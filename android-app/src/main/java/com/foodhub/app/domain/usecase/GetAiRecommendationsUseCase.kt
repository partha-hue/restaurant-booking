package com.foodhub.app.domain.usecase

import com.foodhub.app.domain.model.Restaurant
import com.google.ai.client.generativeai.GenerativeModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class GetAiRecommendationsUseCase @Inject constructor(
    private val generativeModel: GenerativeModel
) {
    suspend operator fun invoke(orderHistory: List<String>, allRestaurants: List<Restaurant>): Flow<List<Restaurant>> = flow {
        val prompt = "Based on my previous orders of ${orderHistory.joinToString()}, " +
                    "which of these restaurants would you recommend? " +
                    "${allRestaurants.joinToString { it.name }}." +
                    "Return only the top 3 names as a comma-separated list."

        try {
            val response = generativeModel.generateContent(prompt)
            val recommendedNames = response.text?.split(",")?.map { it.trim() } ?: emptyList()
            
            val recommendations = allRestaurants.filter { restaurant ->
                recommendedNames.any { name -> restaurant.name.contains(name, ignoreCase = true) }
            }
            emit(recommendations)
        } catch (e: Exception) {
            // Fallback: emit empty list if AI fails or is unavailable
            emit(emptyList())
        }
    }
}
