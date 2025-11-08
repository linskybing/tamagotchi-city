import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Trophy, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { startTravelQuest, completeBreakthrough, Attraction } from "@/lib/api";
import { toast } from "sonner";
import TPButton from "@/components/TPButton/TPButton";

const landmarks = [
  { 
    name: "台北101", 
    description: "台北最高地標", 
    bonus: { strength: 10, mood: 5 },
    category: "景點",
    lat: 25.0340,
    lng: 121.5645
  },
  { 
    name: "象山步道", 
    description: "登高望遠好去處", 
    bonus: { strength: 15, mood: 10 },
    category: "景點",
    lat: 25.0236,
    lng: 121.5719
  },
  { 
    name: "大安森林公園", 
    description: "都市綠洲", 
    bonus: { mood: 15 },
    category: "公園",
    lat: 25.0263,
    lng: 121.5436
  },
  { 
    name: "陽明山國家公園", 
    description: "自然步道天堂", 
    bonus: { strength: 20, mood: 15 },
    category: "景點",
    lat: 25.1622,
    lng: 121.5458
  },
  { 
    name: "北投溫泉", 
    description: "放鬆身心靈", 
    bonus: { mood: 20 },
    category: "景點",
    lat: 25.1373,
    lng: 121.5081
  },
  { 
    name: "天母運動公園", 
    description: "運動設施完善", 
    bonus: { strength: 12, mood: 8 },
    category: "運動場館",
    lat: 25.1163,
    lng: 121.5283
  },
  { 
    name: "台北小巨蛋", 
    description: "大型體育館", 
    bonus: { strength: 15 },
    category: "運動場館",
    lat: 25.0518,
    lng: 121.5494
  },
  { 
    name: "河濱自行車道", 
    description: "騎車運動好去處", 
    bonus: { strength: 18, mood: 12 },
    category: "運動場館",
    lat: 25.0408,
    lng: 121.5094
  },
];

const Travel = () => {
  const navigate = useNavigate();
  const { userId, pet, refreshPet } = useUser();
  const [selectedLandmark, setSelectedLandmark] = useState<Attraction | null>(null);
  const [targetAttraction, setTargetAttraction] = useState<Attraction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if breakthrough is needed
  const needsBreakthrough = pet && pet.level % 5 === 0 && pet.level >= 5 && !pet.breakthrough_completed;

  // Load breakthrough quest when component mounts if needed
  useEffect(() => {
    if (needsBreakthrough && userId && !targetAttraction) {
      loadBreakthroughQuest();
    }
  }, [needsBreakthrough, userId]);

  const loadBreakthroughQuest = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const attraction = await startTravelQuest(userId);
      setTargetAttraction(attraction);
      setSelectedLandmark(attraction);
      toast.success(`突破任務：請前往 ${attraction.name}`);
    } catch (error) {
      console.error("Failed to load breakthrough quest:", error);
      toast.error("無法加載突破任務");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (landmark: Attraction) => {
    if (!userId) {
      toast.error("請先登入");
      return;
    }

    // Check if GPS is available
    if (!navigator.geolocation) {
      toast.error("瀏覽器不支援GPS定位");
      return;
    }

    setIsLoading(true);
    
    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // Calculate distance (simple Haversine formula)
        const R = 6371e3; // Earth radius in meters
        const φ1 = (userLat * Math.PI) / 180;
        const φ2 = (landmark.latitude * Math.PI) / 180;
        const Δφ = ((landmark.latitude - userLat) * Math.PI) / 180;
        const Δλ = ((landmark.longitude - userLng) * Math.PI) / 180;
        
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        // Check if within 100 meters (可調整)
        if (distance > 100) {
          toast.error(`距離目標還有 ${Math.round(distance)}公尺，請靠近後再打卡`);
          setIsLoading(false);
          return;
        }

        // Complete breakthrough if this is the target attraction
        if (needsBreakthrough && targetAttraction?.id === landmark.id) {
          try {
            const result = await completeBreakthrough(userId);
            toast.success(result.message || "突破成功！");
            await refreshPet();
            setTargetAttraction(null);
          } catch (error) {
            console.error("Failed to complete breakthrough:", error);
            toast.error("完成突破失敗");
          }
        } else {
          toast.success(`打卡成功 ${landmark.name}！`);
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("無法獲取位置，請確保已授權定位");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!userId) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{ backgroundColor: 'var(--tp-primary-50)' }}>
        <Card className="p-6 text-center">
          <p>請先登入</p>
          <Button onClick={() => navigate("/")} className="mt-4">返回首頁</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--tp-primary-50)' }}>
      <div className="max-w-md mx-auto space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
          style={{ color: 'var(--tp-primary-700)' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>

        <div className="tp-h2-semibold" style={{ color: 'var(--tp-primary-700)' }}>
          旅遊突破
        </div>

        {selectedLandmark && (
          <Card className="p-6 space-y-4" style={{ backgroundColor: 'var(--tp-white)', borderColor: 'var(--tp-primary-300)' }}>
            <div 
              className="rounded-xl p-6 space-y-4"
              style={{ background: 'linear-gradient(135deg, var(--tp-primary-200), var(--tp-secondary-200))' }}
            >
              <div className="flex items-center justify-center">
                <div 
                  className="rounded-full p-4"
                  style={{ backgroundColor: 'var(--tp-primary-500)' }}
                >
                  <MapPin className="w-8 h-8" style={{ color: 'var(--tp-white)' }} />
                </div>
              </div>
              
              <div className="text-center">
                <div 
                  className="inline-block px-3 py-1 rounded-full tp-caption mb-2"
                  style={{ 
                    backgroundColor: 'var(--tp-white)',
                    color: 'var(--tp-primary-700)'
                  }}
                >
                  {selectedLandmark.category}
                </div>
                <h2 className="tp-h2-semibold mb-2" style={{ color: 'var(--tp-grayscale-900)' }}>
                  {selectedLandmark.name}
                </h2>
                <p className="tp-body-regular" style={{ color: 'var(--tp-grayscale-700)' }}>
                  {selectedLandmark.description}
                </p>
              </div>

              <div 
                className="rounded-lg p-4 flex items-center justify-between"
                style={{ backgroundColor: 'var(--tp-white)' }}
              >
                <span className="tp-body-regular" style={{ color: 'var(--tp-grayscale-600)' }}>完成獎勵</span>
                <span className="tp-body-semibold flex items-center gap-1" style={{ color: 'var(--tp-secondary-700)' }}>
                  <Trophy className="w-4 h-4" />
                  {getBonusText(selectedLandmark.bonus)}
                </span>
              </div>
            </div>

            <TPButton 
              variant="primary" 
              className="w-full"
              onClick={() => handleCheckIn(selectedLandmark)}
            >
              <Navigation className="w-4 h-4 mr-2" />
              前往打卡
            </TPButton>
          </Card>
        )}

        <Card className="p-6 space-y-4" style={{ backgroundColor: 'var(--tp-white)', borderColor: 'var(--tp-primary-200)' }}>
          <h3 className="tp-h3-semibold" style={{ color: 'var(--tp-grayscale-800)' }}>
            台北運動景點
          </h3>
          <div className="space-y-2">
            {landmarks.map((landmark, index) => (
              <div
                key={index}
                className="rounded-lg p-3 cursor-pointer transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: selectedLandmark?.name === landmark.name 
                    ? 'var(--tp-primary-100)' 
                    : 'var(--tp-grayscale-50)',
                  borderLeft: `4px solid ${landmark.category === '運動場館' ? 'var(--tp-secondary-500)' : 'var(--tp-primary-500)'}`
                }}
                onClick={() => setSelectedLandmark(landmark)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="tp-body-semibold" style={{ color: 'var(--tp-grayscale-800)' }}>
                        {landmark.name}
                      </div>
                      <span 
                        className="tp-caption px-2 py-0.5 rounded"
                        style={{ 
                          backgroundColor: landmark.category === '運動場館' 
                            ? 'var(--tp-secondary-100)' 
                            : 'var(--tp-primary-100)',
                          color: landmark.category === '運動場館'
                            ? 'var(--tp-secondary-700)'
                            : 'var(--tp-primary-700)'
                        }}
                      >
                        {landmark.category}
                      </span>
                    </div>
                    <div className="tp-caption" style={{ color: 'var(--tp-grayscale-500)' }}>
                      {landmark.description}
                    </div>
                  </div>
                  <div className="tp-caption text-right" style={{ color: 'var(--tp-secondary-600)' }}>
                    {getBonusText(landmark.bonus)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4" style={{ backgroundColor: 'var(--tp-secondary-50)', borderColor: 'var(--tp-secondary-300)' }}>
          <p className="tp-body-regular text-center" style={{ color: 'var(--tp-secondary-800)' }}>
            💡 點選景點後可前往打卡，獲得力量值與心情值獎勵！
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Travel;
