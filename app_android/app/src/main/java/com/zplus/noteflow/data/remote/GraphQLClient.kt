package com.zplus.noteflow.data.remote

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException

class GraphQLClient(
    private val baseUrl: String = "http://localhost:3000/graphql",
    private val authToken: String? = null
) {
    private val client = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val original = chain.request()
            val requestBuilder = original.newBuilder()
            
            // Add authorization header if token is available
            authToken?.let { token ->
                requestBuilder.header("Authorization", "Bearer $token")
            }
            
            requestBuilder.header("Content-Type", "application/json")
            chain.proceed(requestBuilder.build())
        }
        .build()
    
    private val gson = Gson()
    
    suspend fun <T> execute(
        query: String,
        variables: Map<String, Any>? = null,
        responseType: Class<T>
    ): Result<T> = withContext(Dispatchers.IO) {
        try {
            val requestBody = GraphQLRequest(query, variables)
            val json = gson.toJson(requestBody)
            
            val request = Request.Builder()
                .url(baseUrl)
                .post(json.toRequestBody("application/json".toMediaType()))
                .build()
            
            val response = client.newCall(request).execute()
            
            if (!response.isSuccessful) {
                return@withContext Result.failure(IOException("HTTP ${response.code}: ${response.message}"))
            }
            
            val responseBody = response.body?.string()
                ?: return@withContext Result.failure(IOException("Empty response body"))
            
            val graphQLResponse = gson.fromJson(responseBody, GraphQLResponse::class.java)
            
            if (graphQLResponse.errors != null && graphQLResponse.errors.isNotEmpty()) {
                val errorMessage = graphQLResponse.errors.joinToString(", ") { it.message }
                return@withContext Result.failure(Exception("GraphQL Error: $errorMessage"))
            }
            
            val data = gson.fromJson(gson.toJson(graphQLResponse.data), responseType)
            Result.success(data)
            
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend inline fun <reified T> execute(
        query: String,
        variables: Map<String, Any>? = null
    ): Result<T> = execute(query, variables, T::class.java)
}

data class GraphQLRequest(
    val query: String,
    val variables: Map<String, Any>? = null
)

data class GraphQLResponse(
    val data: Any?,
    val errors: List<GraphQLError>?
)

data class GraphQLError(
    val message: String,
    val locations: List<GraphQLLocation>? = null,
    val path: List<String>? = null
)

data class GraphQLLocation(
    val line: Int,
    val column: Int
)