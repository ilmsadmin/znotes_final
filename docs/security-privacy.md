# Security & Privacy - NoteFlow

## Tổng quan bảo mật

NoteFlow được thiết kế với bảo mật được tích hợp từ đầu (security by design), tuân thủ các tiêu chuẩn bảo mật hiện đại và quy định về quyền riêng tư như GDPR, CCPA. Hệ thống sử dụng defense-in-depth strategy để bảo vệ dữ liệu người dùng ở mọi tầng.

## Kiến trúc bảo mật

### Security Layers

```
┌─────────────────────────────────────────┐
│         User Interface Layer            │ ← Input validation, XSS protection
├─────────────────────────────────────────┤
│      Application Security Layer         │ ← Authentication, Authorization  
├─────────────────────────────────────────┤
│       API Security Layer                │ ← Rate limiting, API security
├─────────────────────────────────────────┤
│     Transport Security Layer            │ ← TLS, Certificate pinning
├─────────────────────────────────────────┤
│      Data Security Layer                │ ← Encryption at rest/transit
├─────────────────────────────────────────┤
│   Infrastructure Security Layer         │ ← Network security, OS hardening
└─────────────────────────────────────────┘
```

### Threat Model

#### Assets
- **User credentials** (email, password, 2FA tokens)
- **Personal data** (notes, tasks, comments, files)
- **Business data** (team information, organizational content)
- **System data** (API keys, database credentials, encryption keys)

#### Threat Actors
- **External attackers** (hackers, malicious actors)
- **Malicious insiders** (compromised accounts, rogue employees)
- **Accidental threats** (user errors, misconfigurations)
- **State actors** (government surveillance, nation-state attacks)

#### Attack Vectors
- **Web application attacks** (XSS, CSRF, injection attacks)
- **API attacks** (authentication bypass, data exposure)
- **Mobile attacks** (app tampering, local storage access)
- **Social engineering** (phishing, credential theft)
- **Infrastructure attacks** (server compromise, network interception)

## Authentication & Authorization

### Multi-Factor Authentication (MFA)

#### Supported Methods
```typescript
interface MFAMethods {
  totp: {
    enabled: boolean;
    secret?: string;
    backupCodes: string[];
  };
  sms: {
    enabled: boolean;
    phoneNumber?: string;
  };
  email: {
    enabled: boolean;
    emailAddress: string;
  };
  webauthn: {
    enabled: boolean;
    credentials: WebAuthnCredential[];
  };
}
```

#### TOTP Implementation
```javascript
// backend/services/mfaService.js
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

class MFAService {
  static generateTOTPSecret(userEmail) {
    const secret = speakeasy.generateSecret({
      name: `NoteFlow (${userEmail})`,
      issuer: 'NoteFlow',
      length: 32
    });
    
    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url
    };
  }
  
  static verifyTOTP(token, secret) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps before/after
    });
  }
  
  static generateBackupCodes() {
    return Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );
  }
}
```

#### WebAuthn Implementation
```javascript
// backend/services/webauthnService.js
const fido2 = require('fido2-lib');

class WebAuthnService {
  constructor() {
    this.fido2 = new fido2.Fido2Lib({
      timeout: 60000,
      rpId: process.env.RP_ID || 'noteflow.app',
      rpName: 'NoteFlow',
      challengeSize: 128,
      attestation: 'none',
      cryptoParams: [-7, -257],
      authenticatorAttachment: 'platform',
      authenticatorRequireResidentKey: false,
      authenticatorUserVerification: 'required'
    });
  }
  
  async generateRegistrationOptions(userId, userEmail) {
    const registrationOptions = await this.fido2.attestationOptions();
    registrationOptions.user = {
      id: Buffer.from(userId),
      name: userEmail,
      displayName: userEmail
    };
    
    return registrationOptions;
  }
  
  async verifyRegistration(attestationResponse, challenge) {
    const attestationExpectations = {
      challenge: challenge,
      origin: process.env.ORIGIN || 'https://noteflow.app',
      factor: 'first'
    };
    
    return await this.fido2.attestationResult(attestationResponse, attestationExpectations);
  }
}
```

### JWT Security

#### Token Structure
```javascript
// backend/services/jwtService.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class JWTService {
  static generateTokenPair(userId, groupId, role) {
    const payload = {
      userId,
      groupId,
      role,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID()
    };
    
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m',
      issuer: 'noteflow-api',
      audience: 'noteflow-app'
    });
    
    const refreshPayload = {
      userId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID()
    };
    
    const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
      issuer: 'noteflow-api',
      audience: 'noteflow-app'
    });
    
    return { accessToken, refreshToken };
  }
  
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'noteflow-api',
        audience: 'noteflow-app'
      });
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
  
  static async revokeToken(jti) {
    // Add to Redis blacklist
    await redis.setex(`blacklist:${jti}`, 900, 'revoked'); // 15 minutes TTL
  }
}
```

### Role-Based Access Control (RBAC)

#### Permission System
```typescript
// types/permissions.ts
enum Permission {
  // Note permissions
  CREATE_NOTE = 'create:note',
  READ_NOTE = 'read:note',
  UPDATE_NOTE = 'update:note',
  DELETE_NOTE = 'delete:note',
  
  // Task permissions
  CREATE_TASK = 'create:task',
  ASSIGN_TASK = 'assign:task',
  UPDATE_TASK_STATUS = 'update:task:status',
  
  // Admin permissions
  MANAGE_USERS = 'manage:users',
  MANAGE_GROUP = 'manage:group',
  VIEW_AUDIT_LOGS = 'view:audit_logs',
  
  // File permissions
  UPLOAD_FILE = 'upload:file',
  DELETE_FILE = 'delete:file'
}

interface Role {
  name: string;
  permissions: Permission[];
}

const ROLES: Record<string, Role> = {
  admin: {
    name: 'Administrator',
    permissions: Object.values(Permission)
  },
  member: {
    name: 'Member',
    permissions: [
      Permission.CREATE_NOTE,
      Permission.READ_NOTE,
      Permission.UPDATE_NOTE,
      Permission.DELETE_NOTE,
      Permission.CREATE_TASK,
      Permission.UPDATE_TASK_STATUS,
      Permission.UPLOAD_FILE
    ]
  }
};
```

#### Authorization Middleware
```javascript
// backend/middleware/authz.js
function requirePermission(permission) {
  return (req, res, next) => {
    const user = req.user;
    const userPermissions = ROLES[user.role]?.permissions || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: permission
      });
    }
    
    next();
  };
}

function requireGroupMembership(groupId) {
  return async (req, res, next) => {
    const user = req.user;
    
    try {
      // Check if user is a member of the specified group
      const membership = await GroupMember.findOne({
        where: {
          groupId: groupId || req.params.groupId,
          userId: user.userId
        }
      });
      
      if (!membership) {
        return res.status(403).json({
          error: 'Access denied - not a member of this group'
        });
      }
      
      req.groupMembership = membership;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Error checking group membership' });
    }
  };
}

function requireResource(resourceType) {
  return async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    
    try {
      const resource = await getResource(resourceType, id);
      
      // Check if user is a member of the resource's group
      const membership = await GroupMember.findOne({
        where: {
          groupId: resource.groupId,
          userId: user.userId
        }
      });
      
      if (!membership) {
        return res.status(403).json({
          error: 'Access denied to resource - not a group member'
        });
      }
      
      // Check if user owns the resource or is group admin
      if (resource.creatorId !== user.userId && membership.role !== 'admin') {
        return res.status(403).json({
          error: 'Access denied to resource - insufficient permissions'
        });
      }
      
      req.resource = resource;
      req.groupMembership = membership;
      next();
    } catch (error) {
      res.status(404).json({ error: 'Resource not found' });
    }
  };
}

function requireGroupAdmin() {
  return async (req, res, next) => {
    const user = req.user;
    const groupId = req.params.groupId;
    
    try {
      const membership = await GroupMember.findOne({
        where: {
          groupId: groupId,
          userId: user.userId,
          role: 'admin'
        }
      });
      
      if (!membership) {
        return res.status(403).json({
          error: 'Access denied - admin role required'
        });
      }
      
      req.groupMembership = membership;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Error checking admin permissions' });
    }
  };
}
```

## Data Encryption

### Encryption at Rest

#### Database Encryption
```sql
-- PostgreSQL transparent data encryption
-- Set up encryption key
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive columns
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    -- Encrypt PII data
    phone_number BYTEA, -- pgp_sym_encrypt(phone, encryption_key)
    address BYTEA,      -- pgp_sym_encrypt(address, encryption_key)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Functions for encryption/decryption
CREATE OR REPLACE FUNCTION encrypt_pii(data TEXT)
RETURNS BYTEA AS $$
BEGIN
    RETURN pgp_sym_encrypt(data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrypt_pii(encrypted_data BYTEA)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(encrypted_data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;
```

#### Application-Level Encryption
```javascript
// backend/services/encryptionService.js
const crypto = require('crypto');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
  }
  
  encrypt(plaintext, key) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }
  
  decrypt(encryptedData, key) {
    const { encrypted, iv, tag } = encryptedData;
    
    const decipher = crypto.createDecipher(
      this.algorithm, 
      key, 
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
  
  generateKey() {
    return crypto.randomBytes(this.keyLength);
  }
}
```

### Encryption in Transit

#### TLS Configuration
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name api.noteflow.app;
    
    # SSL certificates
    ssl_certificate /etc/ssl/certs/noteflow.crt;
    ssl_certificate_key /etc/ssl/private/noteflow.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Other security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Certificate Pinning (Mobile)
```swift
// iOS certificate pinning
class CertificatePinner: NSURLSessionDelegate {
    private let certificates: [Data]
    
    init() {
        // Load pinned certificates from bundle
        guard let certPath = Bundle.main.path(forResource: "noteflow", ofType: "cer"),
              let certData = NSData(contentsOfFile: certPath) else {
            fatalError("Failed to load pinned certificate")
        }
        self.certificates = [certData as Data]
    }
    
    func urlSession(_ session: URLSession, 
                   didReceive challenge: URLAuthenticationChallenge, 
                   completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        
        guard let serverTrust = challenge.protectionSpace.serverTrust else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }
        
        // Verify certificate chain
        let policy = SecPolicyCreateSSL(true, "api.noteflow.app" as CFString)
        SecTrustSetPolicies(serverTrust, policy)
        
        var status = SecTrustEvaluate(serverTrust, nil)
        guard status == errSecSuccess else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }
        
        // Pin certificate
        guard let serverCertificate = SecTrustGetCertificateAtIndex(serverTrust, 0) else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }
        
        let serverCertData = SecCertificateCopyData(serverCertificate)
        let serverCertBytes = CFDataGetBytePtr(serverCertData!)
        let serverCertLength = CFDataGetLength(serverCertData!)
        let serverData = Data(bytes: serverCertBytes!, count: serverCertLength)
        
        if certificates.contains(serverData) {
            completionHandler(.useCredential, URLCredential(trust: serverTrust))
        } else {
            completionHandler(.cancelAuthenticationChallenge, nil)
        }
    }
}
```

### Mobile Local Storage Encryption

#### iOS Keychain Integration
```swift
// iOS secure storage
import Security

class SecureStorage {
    private let service = "com.noteflow.app"
    
    func store(key: String, value: Data) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: value,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]
        
        let status = SecItemAdd(query as CFDictionary, nil)
        
        if status == errSecDuplicateItem {
            // Update existing item
            let updateQuery: [String: Any] = [
                kSecClass as String: kSecClassGenericPassword,
                kSecAttrService as String: service,
                kSecAttrAccount as String: key
            ]
            
            let updateAttributes: [String: Any] = [
                kSecValueData as String: value
            ]
            
            let updateStatus = SecItemUpdate(updateQuery as CFDictionary, updateAttributes as CFDictionary)
            guard updateStatus == errSecSuccess else {
                throw SecureStorageError.updateFailed
            }
        } else if status != errSecSuccess {
            throw SecureStorageError.storeFailed
        }
    }
    
    func retrieve(key: String) throws -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess else {
            if status == errSecItemNotFound {
                return nil
            }
            throw SecureStorageError.retrieveFailed
        }
        
        return result as? Data
    }
}
```

#### Android Encrypted SharedPreferences
```kotlin
// Android secure storage
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class SecureStorage(private val context: Context) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()
    
    private val sharedPreferences = EncryptedSharedPreferences.create(
        context,
        "secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
    
    fun store(key: String, value: String) {
        sharedPreferences.edit()
            .putString(key, value)
            .apply()
    }
    
    fun retrieve(key: String): String? {
        return sharedPreferences.getString(key, null)
    }
    
    fun remove(key: String) {
        sharedPreferences.edit()
            .remove(key)
            .apply()
    }
}

// Database encryption
@Database(
    entities = [Note::class, User::class],
    version = 1,
    exportSchema = false
)
abstract class NoteFlowDatabase : RoomDatabase() {
    companion object {
        fun create(context: Context): NoteFlowDatabase {
            val passphrase = SQLiteDatabase.getBytes("secure_passphrase".toCharArray())
            val factory = SupportFactory(passphrase)
            
            return Room.databaseBuilder(
                context,
                NoteFlowDatabase::class.java,
                "noteflow.db"
            )
            .openHelperFactory(factory)
            .build()
        }
    }
}
```

## API Security

### Rate Limiting

#### Redis-based Rate Limiter
```javascript
// backend/middleware/rateLimiter.js
const redis = require('redis');
const client = redis.createClient();

class RateLimiter {
  static async checkRateLimit(identifier, windowMs, maxRequests) {
    const key = `rate_limit:${identifier}`;
    const window = Math.floor(Date.now() / windowMs);
    const windowKey = `${key}:${window}`;
    
    const pipeline = client.pipeline();
    pipeline.incr(windowKey);
    pipeline.expire(windowKey, Math.ceil(windowMs / 1000));
    
    const results = await pipeline.exec();
    const currentRequests = results[0][1];
    
    if (currentRequests > maxRequests) {
      throw new RateLimitError('Rate limit exceeded');
    }
    
    return {
      requests: currentRequests,
      remaining: Math.max(0, maxRequests - currentRequests),
      resetTime: (window + 1) * windowMs
    };
  }
}

// Rate limiting middleware
function rateLimit(windowMs, maxRequests) {
  return async (req, res, next) => {
    try {
      const identifier = req.user?.userId || req.ip;
      const result = await RateLimiter.checkRateLimit(identifier, windowMs, maxRequests);
      
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000)
      });
      
      next();
    } catch (error) {
      if (error instanceof RateLimitError) {
        res.status(429).json({
          error: 'Too Many Requests',
          retryAfter: Math.ceil(windowMs / 1000)
        });
      } else {
        next(error);
      }
    }
  };
}
```

### Input Validation & Sanitization

#### Joi Schema Validation
```javascript
// backend/validation/schemas.js
const Joi = require('joi');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const noteSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(500)
    .required()
    .custom((value, helpers) => {
      // Sanitize HTML content
      const sanitized = purify.sanitize(value, { ALLOWED_TAGS: [] });
      if (sanitized !== value) {
        return helpers.error('any.invalid');
      }
      return sanitized;
    }),
  
  content: Joi.string()
    .max(50000)
    .optional()
    .custom((value, helpers) => {
      // Allow specific HTML tags for rich text
      const sanitized = purify.sanitize(value, {
        ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li', 'a'],
        ALLOWED_ATTR: ['href']
      });
      return sanitized;
    }),
  
  type: Joi.string()
    .valid('note', 'task', 'issue')
    .required(),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional(),
  
  tags: Joi.array()
    .items(Joi.string().max(50))
    .max(10)
    .optional(),
  
  deadline: Joi.date()
    .iso()
    .greater('now')
    .optional()
});

// Validation middleware
function validateInput(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    req.validatedBody = value;
    next();
  };
}
```

### CORS Configuration
```javascript
// backend/middleware/cors.js
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://noteflow.app',
      'https://www.noteflow.app',
      'https://app.noteflow.app'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key'
  ],
  maxAge: 86400 // 24 hours
};

module.exports = cors(corsOptions);
```

## Audit Logging

### Comprehensive Audit System
```javascript
// backend/services/auditService.js
class AuditService {
  static async logEvent(eventData) {
    const auditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      userId: eventData.userId,
      userEmail: eventData.userEmail,
      action: eventData.action,
      resource: eventData.resource,
      resourceId: eventData.resourceId,
      details: eventData.details,
      ipAddress: eventData.ipAddress,
      userAgent: eventData.userAgent,
      sessionId: eventData.sessionId,
      outcome: eventData.outcome || 'success',
      risk: this.calculateRiskScore(eventData)
    };
    
    // Log to database
    await db.auditLogs.create(auditLog);
    
    // Log to external SIEM if high risk
    if (auditLog.risk >= 8) {
      await this.sendToSIEM(auditLog);
    }
    
    return auditLog;
  }
  
  static calculateRiskScore(eventData) {
    let score = 0;
    
    // High-risk actions
    const highRiskActions = ['delete_user', 'export_data', 'change_permissions'];
    if (highRiskActions.includes(eventData.action)) {
      score += 5;
    }
    
    // Admin actions
    if (eventData.action.startsWith('admin_')) {
      score += 3;
    }
    
    // Failed attempts
    if (eventData.outcome === 'failure') {
      score += 2;
    }
    
    // Off-hours access
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      score += 1;
    }
    
    return Math.min(score, 10);
  }
  
  static async sendToSIEM(auditLog) {
    // Send to external SIEM system
    await fetch(process.env.SIEM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SIEM_TOKEN}`
      },
      body: JSON.stringify(auditLog)
    });
  }
}

// Audit middleware
function auditMiddleware(action, resource) {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log after response
      setImmediate(async () => {
        try {
          await AuditService.logEvent({
            userId: req.user?.userId,
            userEmail: req.user?.email,
            action: action,
            resource: resource,
            resourceId: req.params.id,
            details: {
              method: req.method,
              url: req.url,
              body: req.body,
              query: req.query
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            sessionId: req.sessionID,
            outcome: res.statusCode >= 400 ? 'failure' : 'success'
          });
        } catch (error) {
          console.error('Audit logging failed:', error);
        }
      });
      
      originalSend.call(this, data);
    };
    
    next();
  };
}
```

## Privacy Compliance

### GDPR Compliance

#### Data Processing Agreement
```javascript
// backend/services/gdprService.js
class GDPRService {
  static async requestDataExport(userId) {
    const userData = await this.collectUserData(userId);
    
    const exportData = {
      personal_information: userData.profile,
      notes: userData.notes,
      tasks: userData.tasks,
      issues: userData.issues,
      comments: userData.comments,
      files: userData.files.map(f => ({ name: f.name, size: f.size, uploadDate: f.createdAt })),
      audit_logs: userData.auditLogs,
      exported_at: new Date().toISOString(),
      format_version: '1.0'
    };
    
    // Create encrypted export file
    const exportJson = JSON.stringify(exportData, null, 2);
    const encryptedExport = await this.encryptExport(exportJson, userId);
    
    // Store temporarily for download
    const exportId = crypto.randomUUID();
    await redis.setex(`export:${exportId}`, 86400, encryptedExport); // 24 hours
    
    // Send notification email
    await this.sendExportNotification(userData.profile.email, exportId);
    
    return exportId;
  }
  
  static async requestDataDeletion(userId, reason) {
    // Log deletion request
    await AuditService.logEvent({
      userId: userId,
      action: 'request_data_deletion',
      resource: 'user',
      resourceId: userId,
      details: { reason }
    });
    
    // Start anonymization process
    await this.anonymizeUserData(userId);
    
    // Remove from active systems
    await this.removeUserFromSystems(userId);
    
    // Keep minimal audit trail (GDPR allows this)
    await this.createDeletionRecord(userId, reason);
  }
  
  static async anonymizeUserData(userId) {
    const anonymousId = `anon_${crypto.randomBytes(8).toString('hex')}`;
    
    // Anonymize personal data
    await db.users.update(userId, {
      name: 'Deleted User',
      email: `${anonymousId}@deleted.local`,
      phone: null,
      address: null,
      avatar_url: null,
      deleted_at: new Date()
    });
    
    // Update content ownership
    await db.notes.updateMany(
      { creator_id: userId },
      { creator_id: anonymousId }
    );
    
    await db.comments.updateMany(
      { user_id: userId },
      { user_id: anonymousId }
    );
  }
}
```

#### Cookie Consent Management
```javascript
// frontend/services/cookieConsent.js
class CookieConsentManager {
  constructor() {
    this.consentKey = 'noteflow_cookie_consent';
    this.consentData = this.loadConsent();
  }
  
  loadConsent() {
    const stored = localStorage.getItem(this.consentKey);
    return stored ? JSON.parse(stored) : null;
  }
  
  saveConsent(consent) {
    const consentRecord = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      preferences: {
        necessary: true, // Always required
        analytics: consent.analytics || false,
        marketing: consent.marketing || false,
        functional: consent.functional || false
      },
      ip: null, // Will be set by server
      userAgent: navigator.userAgent
    };
    
    localStorage.setItem(this.consentKey, JSON.stringify(consentRecord));
    this.consentData = consentRecord;
    
    // Send to server
    this.reportConsent(consentRecord);
    
    // Apply consent settings
    this.applyConsentSettings();
  }
  
  async reportConsent(consent) {
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consent)
      });
    } catch (error) {
      console.error('Failed to report consent:', error);
    }
  }
  
  applyConsentSettings() {
    if (!this.consentData) return;
    
    const { preferences } = this.consentData;
    
    // Analytics
    if (preferences.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }
    
    // Marketing
    if (preferences.marketing) {
      this.enableMarketing();
    } else {
      this.disableMarketing();
    }
  }
  
  hasConsent(category) {
    return this.consentData?.preferences[category] || false;
  }
}
```

## Security Monitoring

### Intrusion Detection
```javascript
// backend/services/intrusionDetection.js
class IntrusionDetectionService {
  static async analyzeRequest(req) {
    const threats = [];
    
    // SQL Injection patterns
    const sqlPatterns = [
      /(\bor\b|\band\b).*=.*=/i,
      /union.*select/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /'.*or.*'.*=.*'/i
    ];
    
    // XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe[^>]*>/i
    ];
    
    const requestString = JSON.stringify(req.body) + req.url + JSON.stringify(req.query);
    
    // Check for SQL injection
    for (const pattern of sqlPatterns) {
      if (pattern.test(requestString)) {
        threats.push({
          type: 'sql_injection',
          severity: 'high',
          pattern: pattern.toString()
        });
      }
    }
    
    // Check for XSS
    for (const pattern of xssPatterns) {
      if (pattern.test(requestString)) {
        threats.push({
          type: 'xss',
          severity: 'high',
          pattern: pattern.toString()
        });
      }
    }
    
    // Check request frequency (DDoS)
    const requestCount = await this.getRequestCount(req.ip);
    if (requestCount > 100) { // per minute
      threats.push({
        type: 'ddos',
        severity: 'medium',
        details: { requestCount }
      });
    }
    
    // Log threats
    if (threats.length > 0) {
      await this.logThreats(req, threats);
    }
    
    return threats;
  }
  
  static async logThreats(req, threats) {
    const threatLog = {
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      threats: threats,
      blocked: threats.some(t => t.severity === 'high')
    };
    
    await db.threatLogs.create(threatLog);
    
    // Alert security team for high severity
    if (threats.some(t => t.severity === 'high')) {
      await this.alertSecurityTeam(threatLog);
    }
  }
}
```

### Vulnerability Management
```javascript
// scripts/security-scan.js
const { execSync } = require('child_process');

class SecurityScanner {
  static async runNpmAudit() {
    try {
      const result = execSync('npm audit --json', { encoding: 'utf8' });
      const auditData = JSON.parse(result);
      
      const vulnerabilities = [];
      
      for (const vuln of Object.values(auditData.vulnerabilities || {})) {
        if (vuln.severity === 'high' || vuln.severity === 'critical') {
          vulnerabilities.push({
            name: vuln.name,
            severity: vuln.severity,
            via: vuln.via,
            fixAvailable: vuln.fixAvailable
          });
        }
      }
      
      return vulnerabilities;
    } catch (error) {
      console.error('npm audit failed:', error.message);
      return [];
    }
  }
  
  static async scanDockerImages() {
    const images = ['noteflow-backend', 'noteflow-frontend'];
    const vulnerabilities = [];
    
    for (const image of images) {
      try {
        const result = execSync(`docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image ${image}`, 
                               { encoding: 'utf8' });
        
        // Parse Trivy output for HIGH and CRITICAL vulnerabilities
        const lines = result.split('\n');
        const highVulns = lines.filter(line => 
          line.includes('HIGH') || line.includes('CRITICAL')
        );
        
        vulnerabilities.push({
          image,
          count: highVulns.length,
          details: highVulns
        });
      } catch (error) {
        console.error(`Failed to scan ${image}:`, error.message);
      }
    }
    
    return vulnerabilities;
  }
  
  static async generateSecurityReport() {
    const report = {
      timestamp: new Date().toISOString(),
      npm_vulnerabilities: await this.runNpmAudit(),
      docker_vulnerabilities: await this.scanDockerImages(),
      // Add more security checks here
    };
    
    // Save report
    await fs.writeFile(
      `security-reports/report-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    );
    
    // Alert if critical issues found
    const criticalIssues = report.npm_vulnerabilities.filter(v => v.severity === 'critical').length +
                          report.docker_vulnerabilities.reduce((sum, img) => sum + img.count, 0);
    
    if (criticalIssues > 0) {
      await this.alertSecurityTeam({
        type: 'vulnerability_scan',
        critical_count: criticalIssues,
        report: report
      });
    }
    
    return report;
  }
}
```

## Incident Response

### Incident Response Plan
```javascript
// backend/services/incidentResponse.js
class IncidentResponseService {
  static async handleSecurityIncident(incident) {
    const incidentId = crypto.randomUUID();
    
    // Log incident
    const incidentRecord = {
      id: incidentId,
      type: incident.type,
      severity: incident.severity,
      description: incident.description,
      detected_at: new Date(),
      status: 'detected',
      responder: null,
      timeline: [
        {
          timestamp: new Date(),
          action: 'incident_detected',
          details: incident
        }
      ]
    };
    
    await db.incidents.create(incidentRecord);
    
    // Auto-respond based on severity
    switch (incident.severity) {
      case 'critical':
        await this.criticalIncidentResponse(incidentId, incident);
        break;
      case 'high':
        await this.highIncidentResponse(incidentId, incident);
        break;
      default:
        await this.standardIncidentResponse(incidentId, incident);
    }
    
    return incidentId;
  }
  
  static async criticalIncidentResponse(incidentId, incident) {
    // Immediate actions for critical incidents
    
    // 1. Alert security team immediately
    await this.alertSecurityTeam({
      priority: 'CRITICAL',
      incident: incident,
      incidentId: incidentId
    });
    
    // 2. Auto-block if attack detected
    if (incident.type === 'attack_detected') {
      await this.blockAttacker(incident.source_ip);
    }
    
    // 3. Enable enhanced monitoring
    await this.enableEnhancedMonitoring();
    
    // 4. Create incident room
    await this.createIncidentRoom(incidentId);
    
    this.updateIncidentTimeline(incidentId, 'critical_response_initiated');
  }
  
  static async blockAttacker(ip) {
    // Add to firewall blacklist
    await this.addFirewallRule('block', ip);
    
    // Add to WAF blacklist
    await this.addWAFRule('block', ip);
    
    // Log action
    await AuditService.logEvent({
      action: 'block_ip',
      resource: 'security',
      details: { ip, reason: 'security_incident' }
    });
  }
}
```

## Security Training & Awareness

### Security Guidelines for Developers
```markdown
# Security Development Guidelines

## Code Review Checklist

### Authentication & Authorization
- [ ] All endpoints require authentication
- [ ] User permissions are checked for sensitive operations
- [ ] JWT tokens are validated properly
- [ ] Session management is secure

### Input Validation
- [ ] All user inputs are validated and sanitized
- [ ] SQL injection protection in place
- [ ] XSS protection implemented
- [ ] File upload validation implemented

### Data Protection
- [ ] Sensitive data is encrypted at rest
- [ ] TLS is used for data in transit
- [ ] Secrets are not hardcoded
- [ ] Personal data handling follows privacy policies

### Error Handling
- [ ] Errors don't leak sensitive information
- [ ] Stack traces are not exposed to users
- [ ] Proper logging without sensitive data
- [ ] Graceful error handling implemented

### Dependencies
- [ ] Dependencies are up to date
- [ ] Known vulnerabilities are addressed
- [ ] Minimal dependency footprint
- [ ] License compliance checked
```

### Security Testing Checklist
```markdown
# Security Testing Checklist

## Automated Security Tests
- [ ] SAST (Static Application Security Testing) passed
- [ ] DAST (Dynamic Application Security Testing) passed
- [ ] Dependency vulnerability scan passed
- [ ] Container security scan passed

## Manual Security Tests
- [ ] Authentication bypass attempts
- [ ] Authorization boundary tests
- [ ] Input validation tests
- [ ] Session management tests
- [ ] File upload security tests

## Infrastructure Security
- [ ] Network security configuration
- [ ] Server hardening checklist
- [ ] Certificate configuration
- [ ] Backup security verification
```

This comprehensive security documentation provides the foundation for building and maintaining a secure NoteFlow application that protects user data and maintains privacy compliance.