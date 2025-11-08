import { useState, useCallback, useRef } from 'react';

// 定義位置資訊的型別
export interface LocationResponse {
    success: boolean;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    altitude?: number;
    heading?: number;
    speed?: number;
    timestamp?: string;
    error?: string;
    message?: string;
}

export interface UseLocationReturn {
    location: LocationResponse | null;
    loading: boolean;
    error: string | null;
    getLocation: () => Promise<LocationResponse | null>;
}

/**
 * Custom hook for getting device location via TownPass flutterObject
 * Falls back to browser geolocation API if flutterObject is not available
 */
export const useLocation = (): UseLocationReturn => {
    const [location, setLocation] = useState<LocationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const listenerRef = useRef<((event: MessageEvent) => void) | null>(null);

    const getLocation = useCallback(async (): Promise<LocationResponse | null> => {
        setLoading(true);
        setError(null);

        // 先嘗試使用 TownPass flutterObject
        if (typeof window.flutterObject !== 'undefined') {
            return new Promise((resolve) => {
                // 清理舊的監聽器
                if (listenerRef.current) {
                    window.flutterObject?.removeEventListener('message', listenerRef.current);
                }

                // 設定監聽器接收回應
                const handleMessage = (event: MessageEvent) => {
                    try {
                        const response = JSON.parse(event.data);

                        // 確認是 location 的回應
                        if (response.name === 'location') {
                            window.flutterObject?.removeEventListener('message', handleMessage);
                            listenerRef.current = null;

                            const locationData: LocationResponse = response.data;
                            setLocation(locationData);
                            setLoading(false);

                            if (locationData.success) {
                                console.log('位置資訊 (TownPass):', locationData);
                                resolve(locationData);
                            } else {
                                const errorMsg = locationData.message || '獲取位置失敗';
                                console.error('獲取位置失敗:', errorMsg);
                                setError(errorMsg);
                                resolve(null);
                            }
                        }
                    } catch (error) {
                        console.error('解析回應失敗:', error);
                        setError('解析位置資訊失敗');
                        setLoading(false);
                        resolve(null);
                    }
                };

                listenerRef.current = handleMessage;

                // 註冊監聽器
                window.flutterObject.addEventListener('message', handleMessage);

                // 發送請求
                try {
                    window.flutterObject.postMessage(
                        JSON.stringify({
                            name: 'location',
                            data: null
                        })
                    );
                } catch (error) {
                    console.error('發送請求失敗:', error);
                    setError('發送位置請求失敗');
                    setLoading(false);
                    window.flutterObject?.removeEventListener('message', handleMessage);
                    listenerRef.current = null;
                    resolve(null);
                }

                // 設定超時
                setTimeout(() => {
                    if (listenerRef.current === handleMessage) {
                        window.flutterObject?.removeEventListener('message', handleMessage);
                        listenerRef.current = null;
                        setError('請求超時');
                        setLoading(false);
                        console.warn('位置請求超時');
                        resolve(null);
                    }
                }, 10000);
            });
        }

        // Fallback: 使用瀏覽器的 Geolocation API
        else {
            console.log('TownPass 不可用，使用瀏覽器 Geolocation API');

            if (!navigator.geolocation) {
                const errorMsg = '您的瀏覽器不支援定位功能';
                setError(errorMsg);
                setLoading(false);
                return null;
            }

            return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const locationData: LocationResponse = {
                            success: true,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            altitude: position.coords.altitude || undefined,
                            heading: position.coords.heading || undefined,
                            speed: position.coords.speed || undefined,
                            timestamp: new Date(position.timestamp).toISOString(),
                        };

                        console.log('位置資訊 (Browser):', locationData);
                        setLocation(locationData);
                        setLoading(false);
                        resolve(locationData);
                    },
                    (error) => {
                        let errorMsg = '獲取位置失敗';
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                errorMsg = '位置權限被拒絕';
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMsg = '位置資訊不可用';
                                break;
                            case error.TIMEOUT:
                                errorMsg = '獲取位置超時';
                                break;
                        }

                        console.error('Geolocation 錯誤:', error);
                        setError(errorMsg);
                        setLoading(false);
                        resolve(null);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            });
        }
    }, []);

    return {
        location,
        loading,
        error,
        getLocation,
    };
};
