package com.foodhub.app.ui.screens.orders

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class Order(val id: String, val restaurantName: String, val date: String, val status: String, val total: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrdersScreen() {
    val mockOrders = listOf(
        Order("101", "Burger King", "Oct 24, 2023", "Delivered", "$24.50"),
        Order("102", "Pizza Hut", "Oct 20, 2023", "Delivered", "$32.00"),
        Order("103", "Sushi Zen", "Oct 15, 2023", "Cancelled", "$45.00")
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Orders", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = Color.White
                )
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.padding(padding).fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(mockOrders) { order ->
                OrderCard(order)
            }
        }
    }
}

@Composable
fun OrderCard(order: Order) {
    Card(
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = order.restaurantName, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text(text = order.total, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = "Order #${order.id}", fontSize = 14.sp, color = Color.Gray)
            Text(text = order.date, fontSize = 14.sp, color = Color.Gray)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = order.status,
                fontWeight = FontWeight.Medium,
                color = if (order.status == "Delivered") Color(0xFF4CAF50) else Color.Red
            )
        }
    }
}
