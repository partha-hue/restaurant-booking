package com.foodhub.app.ui.screens.detail

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RestaurantDetailScreen(restaurantId: String, onBack: () -> Unit, onAddToCart: () -> Unit) {
    val scrollState = rememberLazyListState()
    val headerHeight = 250.dp
    val headerHeightPx = with(LocalDensity.current) { headerHeight.toPx() }

    val toolbarAlpha by remember {
        derivedStateOf {
            val firstVisibleItemIndex = scrollState.firstVisibleItemIndex
            if (firstVisibleItemIndex > 0) 1f
            else (scrollState.firstVisibleItemOffset.toFloat() / headerHeightPx).coerceIn(0f, 1f)
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            state = scrollState,
            modifier = Modifier.fillMaxSize()
        ) {
            // Parallax Header Placeholder
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(headerHeight)
                        .graphicsLayer {
                            translationY = scrollState.firstVisibleItemOffset.toFloat() / 2f
                        }
                        .background(Color.LightGray)
                ) {
                    Text(
                        "Restaurant Header Image",
                        modifier = Modifier.align(Alignment.Center),
                        color = Color.White
                    )
                }
            }

            // Restaurant Info
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Text(
                        text = "Burger King #$restaurantId",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Star, contentDescription = null, tint = Color(0xFFFFB300), modifier = Modifier.size(20.dp))
                        Text(" 4.5 (500+ ratings) • Burgers • 20-30 min", fontSize = 14.sp)
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Popular Items", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
            }

            // Menu Items
            items(10) { index ->
                MenuItemRow(onAddToCart = onAddToCart)
            }
        }

        // Translucent Top Bar
        TopAppBar(
            title = {
                if (toolbarAlpha > 0.5f) {
                    Text("Burger King", color = Color.White)
                }
            },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(
                        Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        tint = if (toolbarAlpha > 0.5f) Color.White else Color.Black
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.primary.copy(alpha = toolbarAlpha),
                titleContentColor = Color.White
            )
        )
    }
}

@Composable
fun MenuItemRow(onAddToCart: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(12.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text("Whopper Combo", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text("Flame-grilled beef patty, lettuce, tomato, mayo...", fontSize = 12.sp, color = Color.Gray, maxLines = 2)
                Text("$12.99", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(top = 4.dp))
            }
            Spacer(modifier = Modifier.width(8.dp))
            Button(onClick = onAddToCart, shape = RoundedCornerShape(8.dp)) {
                Text("Add")
            }
        }
    }
}
