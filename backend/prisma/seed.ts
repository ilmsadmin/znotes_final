import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Admin account details
  const adminEmail = 'toan@zplus.vn';
  const adminName = 'ToanLinh';
  const adminFirebaseUid = 'admin-toan-firebase-uid';
  const adminDomain = 'zplus.vn';

  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log(`Admin user ${adminEmail} already exists. Skipping creation.`);
      return;
    }

    // Create or find admin group
    let adminGroup = await prisma.group.findFirst({
      where: { 
        name: { contains: adminDomain }
      }
    });

    // Create admin user first
    const adminUser = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        firebaseUid: adminFirebaseUid,
        lastActive: new Date(),
      },
    });

    console.log(`✅ Created admin user: ${adminEmail}`);

    if (!adminGroup) {
      // Create admin group with the user as creator
      adminGroup = await prisma.group.create({
        data: {
          name: `${adminDomain} Admin Group`,
          description: `Admin group for ${adminDomain} domain`,
          creatorId: adminUser.id,
          maxMembers: 10,
          settings: {
            allowInvitations: true,
            requireApproval: false,
            features: {
              notes: true,
              tasks: true,
              issues: true,
              collaboration: true
            }
          }
        },
      });

      console.log(`✅ Created admin group: ${adminGroup.name}`);
    }

    // Create admin group membership with admin role
    await prisma.groupMember.create({
      data: {
        groupId: adminGroup.id,
        userId: adminUser.id,
        role: Role.admin,
        joinedAt: new Date(),
      },
    });

    console.log(`✅ Added admin user to group with admin role`);

    // Create user group limits for admin
    await prisma.userGroupLimits.create({
      data: {
        userId: adminUser.id,
        createdGroupsCount: adminGroup.creatorId === adminUser.id ? 1 : 0,
        maxGroupsAllowed: 10, // Admin gets higher limits
      },
    });

    console.log(`✅ Created user group limits for admin`);

    // Create some sample data for testing
    await createSampleData(adminUser.id, adminGroup.id);

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('Admin Account Details:');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`👤 Name: ${adminName}`);
    console.log(`🔑 Firebase UID: ${adminFirebaseUid}`);
    console.log('');
    console.log('For development authentication, use Bearer token format:');
    console.log(`Authorization: Bearer ${adminFirebaseUid}:${adminEmail}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

async function createSampleData(adminUserId: string, adminGroupId: string) {
  console.log('Creating sample data...');

  // Create a sample note
  const sampleNote = await prisma.note.create({
    data: {
      title: 'Welcome to NoteFlow',
      content: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Welcome to NoteFlow! This is a sample note to get you started.'
              }
            ]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'You can create notes, assign tasks, track issues, and collaborate with your team.'
              }
            ]
          }
        ]
      }),
      status: 'open',
      priority: 'medium',
      creatorId: adminUserId,
      lastModifiedBy: adminUserId,
      groupId: adminGroupId,
      tags: ['welcome', 'getting-started'],
      metadata: {
        category: 'documentation',
        version: 1
      }
    },
  });

  console.log(`✅ Created sample note: ${sampleNote.title}`);

  // Create a sample assignment
  await prisma.assignment.create({
    data: {
      noteId: sampleNote.id,
      assigneeId: adminUserId,
    },
  });

  console.log(`✅ Created sample assignment for note`);

  // Create a sample comment
  await prisma.comment.create({
    data: {
      noteId: sampleNote.id,
      authorId: adminUserId,
      lastModifiedBy: adminUserId,
      content: 'This is a sample comment. You can use comments to collaborate and discuss notes with your team.',
      metadata: {
        type: 'general',
        mentions: []
      }
    },
  });

  console.log(`✅ Created sample comment`);

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: 'note_created',
      details: {
        noteTitle: sampleNote.title,
        action: 'created_sample_note'
      }
    },
  });

  console.log(`✅ Created activity log entry`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
