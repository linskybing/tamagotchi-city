import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, TrendingUp, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { getDailyQuests } from "@/lib/api";
import { useEffect, useState } from "react";
import type { UserQuest } from "@/lib/api";

const Status = () => {
  const navigate = useNavigate();
  const { userId, pet } = useUser();
  const [quests, setQuests] = useState<UserQuest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuests = async () => {
      if (!userId) return;
      try {
        const questData = await getDailyQuests(userId);
        setQuests(questData);
      } catch (error) {
        console.error("Failed to fetch quests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuests();
  }, [userId]);

  if (!pet) {
    return (
      <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--tp-primary-50)' }}>
        <div className="max-w-md mx-auto">
          <div className="tp-h2-semibold" style={{ color: 'var(--tp-primary-700)' }}>
            載入中...
          </div>
        </div>
      </div>
    );
  }

  const completedQuests = quests.filter(q => q.is_completed).length;
  const totalQuests = quests.length;
  const currentLevelStrength = pet.strength % 120;

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--tp-primary-50)' }}>
      <div className="max-w-md mx-auto space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-2 p-0"
          style={{ color: 'var(--tp-primary-700)' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>

        <div className="tp-h2-semibold" style={{ color: 'var(--tp-primary-700)' }}>
          運動狀態
        </div>

        {/* Today's Summary */}
        <Card className="p-6" style={{ backgroundColor: 'var(--tp-white)', borderColor: 'var(--tp-primary-200)' }}>
          <div className="tp-h3-semibold mb-4" style={{ color: 'var(--tp-grayscale-800)' }}>
            目前狀態
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="tp-caption" style={{ color: 'var(--tp-grayscale-500)' }}>等級</div>
              <div className="tp-h2-semibold" style={{ color: 'var(--tp-primary-600)' }}>{pet.level}</div>
            </div>
            <div className="text-center">
              <div className="tp-caption" style={{ color: 'var(--tp-grayscale-500)' }}>力量值</div>
              <div className="tp-h2-semibold" style={{ color: 'var(--tp-secondary-600)' }}>{currentLevelStrength}/120</div>
            </div>
            <div className="text-center">
              <div className="tp-caption" style={{ color: 'var(--tp-grayscale-500)' }}>心情值</div>
              <div className="tp-h2-semibold" style={{ color: 'var(--tp-orange-600)' }}>{pet.mood}</div>
            </div>
          </div>
        </Card>

        {/* Stamina Status */}
        <Card className="p-6" style={{ backgroundColor: 'var(--tp-white)', borderColor: 'var(--tp-primary-200)' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--tp-primary-600)' }} />
            <div className="tp-h3-semibold" style={{ color: 'var(--tp-grayscale-800)' }}>
              今日體力
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between tp-body-regular">
              <span style={{ color: 'var(--tp-grayscale-600)' }}>剩餘體力</span>
              <span style={{ color: 'var(--tp-primary-600)' }}>{pet.stamina}/900</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--tp-grayscale-200)' }}>
              <div
                className="h-full transition-all"
                style={{
                  width: `${(pet.stamina / 900) * 100}%`,
                  backgroundColor: pet.stamina > 300 ? 'var(--tp-primary-500)' : 'var(--tp-orange-500)'
                }}
              />
            </div>
            <div className="tp-caption" style={{ color: 'var(--tp-grayscale-500)' }}>
              {pet.stamina > 0 ? '還可以運動！' : '今天已經運動足夠了，好好休息吧！'}
            </div>
          </div>
        </Card>

        {/* Daily Quests */}
        <Card className="p-6" style={{ backgroundColor: 'var(--tp-white)', borderColor: 'var(--tp-primary-200)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" style={{ color: 'var(--tp-primary-600)' }} />
            <div className="tp-h3-semibold" style={{ color: 'var(--tp-grayscale-800)' }}>
              每日任務
            </div>
            <span className="ml-auto tp-body-regular" style={{ color: 'var(--tp-grayscale-600)' }}>
              {completedQuests}/{totalQuests}
            </span>
          </div>
          {isLoading ? (
            <div className="tp-body-regular" style={{ color: 'var(--tp-grayscale-500)' }}>
              載入中...
            </div>
          ) : quests.length === 0 ? (
            <div className="tp-body-regular" style={{ color: 'var(--tp-grayscale-500)' }}>
              暫無任務
            </div>
          ) : (
            <div className="space-y-3">
              {quests.map((userQuest) => (
                <div
                  key={userQuest.id}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: userQuest.is_completed ? 'var(--tp-green-50)' : 'var(--tp-primary-50)' }}
                >
                  {userQuest.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--tp-green-600)' }} />
                  ) : (
                    <Circle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--tp-grayscale-400)' }} />
                  )}
                  <div className="flex-1">
                    <div className="tp-body-semibold" style={{ color: 'var(--tp-grayscale-800)' }}>
                      {userQuest.quest.title}
                    </div>
                    <div className="tp-caption" style={{ color: 'var(--tp-grayscale-500)' }}>
                      {userQuest.quest.description}
                    </div>
                    <div className="flex gap-2 mt-1">
                      {userQuest.quest.reward_strength > 0 && (
                        <span className="tp-caption" style={{ color: 'var(--tp-secondary-600)' }}>
                          💪 +{userQuest.quest.reward_strength}
                        </span>
                      )}
                      {userQuest.quest.reward_stamina > 0 && (
                        <span className="tp-caption" style={{ color: 'var(--tp-primary-600)' }}>
                          ❤️ +{userQuest.quest.reward_stamina}
                        </span>
                      )}
                      {userQuest.quest.reward_mood > 0 && (
                        <span className="tp-caption" style={{ color: 'var(--tp-orange-600)' }}>
                          😊 +{userQuest.quest.reward_mood}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Status;
