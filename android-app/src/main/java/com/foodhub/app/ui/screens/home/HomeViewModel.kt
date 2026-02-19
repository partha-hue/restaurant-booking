package com.foodhub.app.ui.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.foodhub.app.domain.model.Restaurant
import com.foodhub.app.domain.usecase.GetAiRecommendationsUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class HomeUiState {
    object Loading : HomeUiState()
    data class Success(
        val restaurants: List<Restaurant>,
        val aiRecommendations: List<Restaurant> = emptyList()
    ) : HomeUiState()
    data class Error(val message: String) : HomeUiState()
}

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val aiUseCase: GetAiRecommendationsUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        fetchRestaurants()
    }

    private fun fetchRestaurants() {
        viewModelScope.launch {
            // Simulate network delay
            delay(1000)
            
            val mockRestaurants = listOf(
                Restaurant("1", "Burger King", "Burgers, Fast Food", 4.5, "20-30 min", "https://example.com/bk.jpg", "https://example.com/bk_header.jpg"),
                Restaurant("2", "Pizza Hut", "Pizza, Italian", 4.2, "30-45 min", "https://example.com/ph.jpg", "https://example.com/ph_header.jpg"),
                Restaurant("3", "Sushi Zen", "Japanese, Sushi", 4.8, "40-55 min", "https://example.com/sushi.jpg", "https://example.com/sushi_header.jpg"),
                Restaurant("4", "Taco Bell", "Mexican, Fast Food", 4.0, "15-25 min", "https://example.com/taco.jpg", "https://example.com/taco_header.jpg"),
                Restaurant("5", "Pasta Express", "Italian, Pasta", 4.3, "25-35 min", "https://example.com/pasta.jpg", "https://example.com/pasta_header.jpg"),
                Restaurant("6", "Healthy Greens", "Salads, Vegan", 4.6, "20-30 min", "https://example.com/salad.jpg", "https://example.com/salad_header.jpg")
            )
            
            _uiState.value = HomeUiState.Success(mockRestaurants)

            // Trigger AI Recommendations based on fake history
            val fakeHistory = listOf("Burger", "Pizza")
            aiUseCase(fakeHistory, mockRestaurants).collectLatest { aiResult ->
                if (_uiState.value is HomeUiState.Success) {
                    _uiState.value = (_uiState.value as HomeUiState.Success).copy(
                        aiRecommendations = aiResult
                    )
                }
            }
        }
    }
}
