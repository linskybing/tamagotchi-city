import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pet from "@/components/Pet";
import StatBar from "@/components/StatBar";
import ActionButton from "@/components/ActionButton";
import { Dumbbell, Map, Calendar } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { getStageName, createUser, getDailyQuests, completeDailyQuest, performDailyCheck, UserQuest } from "@/lib/api";
import { toast } from "sonner";

const IndexWithAPI = () => {
  const navigate = useNavigate();
  const { userId, setUserId, pet, refreshPet, isLoading } = useUser();
  const [newUsername, setNewUsername] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [dailyQuests, setDailyQuests] = useState<UserQuest[]>([]);

  // Perform daily check on mount
  useEffect(() => {
    if (userId) {
      performDailyCheck(userId).catch(console.error);
      loadDailyQuests();
    }
  }, [userId]);

  const loadDailyQuests = async () => {
    if (!userId) return;
    try {
      const quests = await getDailyQuests(userId);
      setDailyQuests(quests);
    } catch (error) {
      console.error("Failed to load daily quests:", error);
    }
  };

  const handleCreateUser = async () => {
    if (!newUsername.trim()) {
      toast.error("請輸入用戶名");
      return;
    }
    setIsCreatingUser(true);
    try {
      const user = await createUser(newUsername.trim());
      setUserId(user.id);
      toast.success(`歡迎 ${user.username}！`);
    } catch (error: any) {
      toast.error(error.message || "創建用戶失敗");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCompleteQuest = async (userQuestId: number) => {
    if (!userId) return;
    try {
      const result = await completeDailyQuest(userId, userQuestId);
      toast.success("任務完成！獲得獎勵");
      if (result.breakthrough_required) {
        toast.info("恭喜達到突破等級！請前往旅遊完成突破任務");
      }
      await refreshPet();
      await loadDailyQuests();
    } catch (error: any) {
      toast.error(error.message || "完成任務失敗");
    }
  };

  // Show login screen if no user
  if (!userId) {
    return (
      <div className="min-h-screen bg-game-bg flex items-center justify-center p-4">
        <Card className="p-6 space-y-4 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-primary">運動之都</h1>
          <p className="text-center text-muted-foreground">請輸入用戶名開始</p>
          <div className="space-y-2">
            <Input
              placeholder="輸入用戶名"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateUser()}
            />
            <Button
              className="w-full"
              onClick={handleCreateUser}
              disabled={isCreatingUser}
            >
              {isCreatingUser ? "創建中..." : "開始遊戲"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading || !pet) {
    return (
      <div className="min-h-screen bg-game-bg flex items-center justify-center">
        <p>加載中...</p>
      </div>
    );
  }

  const petStage = getStageName(pet.stage);
  const completedQuests = dailyQuests.filter((q) => q.completed).length;

  return (
    <div className="min-h-screen bg-game-bg">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">運動之都</h1>
            <p className="text-sm text-muted-foreground">
              {pet.name} Lv.{pet.level}
              {pet.level % 5 === 0 && pet.level >= 5 && !pet.breakthrough_completed && (
                <span className="ml-2 text-red-500">需要突破！</span>
              )}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUserId(null)}
          >
            登出
          </Button>
        </div>

        {/* Pet Display */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-center">
            <Pet stage={petStage} mood={pet.mood} />
          </div>
          
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              {petStage === "egg" && "蛋"}
              {petStage === "small" && "小雞"}
              {petStage === "medium" && "中雞"}
              {petStage === "large" && "大雞"}
              {petStage === "buff" && "大胸雞"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {pet.mood > 70 && "心情超好！"}
              {pet.mood > 40 && pet.mood <= 70 && "狀態不錯"}
              {pet.mood <= 40 && "需要關注..."}
            </p>
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground mb-2">能力值</h3>
          <StatBar label="力量值" value={pet.strength % 120} max={120} icon="💪" />
          <div className="text-xs text-muted-foreground">
            總力量: {pet.strength} (每120點升1級)
          </div>
          <StatBar label="體力值" value={pet.stamina} max={900} icon="❤️" />
          <StatBar label="心情" value={pet.mood} max={100} icon="😊" />
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <ActionButton
            icon={Dumbbell}
            label="運動"
            onClick={() => navigate("/exercise")}
          />
          <ActionButton
            icon={Map}
            label="旅遊"
            onClick={() => navigate("/travel")}
            variant="accent"
          />
        </div>

        {/* Daily Missions */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              每日任務
            </h3>
            <span className="text-xs text-muted-foreground">
              {completedQuests}/{dailyQuests.length} 完成
            </span>
          </div>
          <div className="space-y-2">
            {dailyQuests.map((userQuest) => (
              <div key={userQuest.id} className="flex items-center gap-2 text-sm">
                <button
                  className={`w-4 h-4 border-2 rounded ${
                    userQuest.completed
                      ? "bg-primary border-primary"
                      : "border-muted hover:border-primary"
                  }`}
                  onClick={() => !userQuest.completed && handleCompleteQuest(userQuest.id)}
                  disabled={userQuest.completed}
                />
                <span className={userQuest.completed ? "line-through text-muted-foreground" : "text-foreground"}>
                  {userQuest.quest.title}
                </span>
                <span className="ml-auto text-accent text-xs">
                  {userQuest.quest.reward_strength > 0 && `+${userQuest.quest.reward_strength}力量 `}
                  {userQuest.quest.reward_stamina > 0 && `+${userQuest.quest.reward_stamina}體力 `}
                  {userQuest.quest.reward_mood > 0 && `+${userQuest.quest.reward_mood}心情`}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IndexWithAPI;
