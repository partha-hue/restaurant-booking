package com.foodhub.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import com.foodhub.app.ui.navigation.FoodHubNavGraph
import com.foodhub.app.ui.theme.FoodHubTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            FoodHubTheme {
                // This is the entry point for our entire UI
                FoodHubNavGraph()
            }
        }
    }
}
