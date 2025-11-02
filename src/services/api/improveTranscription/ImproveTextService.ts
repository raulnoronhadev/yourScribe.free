import type { TranscriptionResponse } from '../../../types/transcription'; 
import api from '../axios-config/axiosConfig';

export const ImproveTextService = async (data: TranscriptionResponse) => {
    const transcription = data.transcription;

    if (!transcription) {
        throw new Error('Transcription is required');
    }
    
    try {
        const response = await api.post('/improve-with-ia', 
            { transcription: transcription },
            { 
                headers: { 
                    'Content-Type': 'application/json' // 👈 Force o header
                } 
            }
        );
        console.log('Response from API:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error improving text:', error.response?.data);
        throw error;
    }
}