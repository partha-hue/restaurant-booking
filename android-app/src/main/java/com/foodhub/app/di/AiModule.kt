package com.foodhub.app.di

import com.google.ai.client.generativeai.GenerativeModel
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AiModule {

    @Provides
    @Singleton
    fun provideGenerativeModel(): GenerativeModel {
        // For Gemini Nano, the model name specifies on-device capabilities.
        // "gemini-nano" is a placeholder; the actual model name will be
        // provided by Google's AICore services on the device.
        return GenerativeModel(modelName = "gemini-nano", apiKey = "")
    }
}
