package com.foodhub.app.domain.model

data class Restaurant(
    val id: String,
    val name: String,
    val cuisine: String,
    val rating: Double,
    val deliveryTime: String,
    val imageUrl: String,
    val headerImageUrl: String
)
