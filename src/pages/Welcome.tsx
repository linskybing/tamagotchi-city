import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { createUser } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Welcome = () => {
    const navigate = useNavigate();
    const { setUserId } = useUser();
    const { toast } = useToast();
    const [petName, setPetName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateUser = async () => {
        if (!petName.trim()) {
            toast({
                title: "錯誤",
                description: "請輸入寵物名稱",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const user = await createUser(petName.trim());
            setUserId(user.id);
            toast({
                title: "歡迎！",
                description: `${petName} 誕生了！`,
            });
            navigate("/");
        } catch (error) {
            toast({
                title: "錯誤",
                description: "創建用戶失敗，請稍後重試",
                variant: "destructive",
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: 'var(--tp-primary-50)' }}
        >
            <Card
                className="w-full max-w-md p-8 space-y-6"
                style={{ backgroundColor: 'var(--tp-white)', borderColor: 'var(--tp-primary-200)' }}
            >
                <div className="text-center space-y-2">
                    <div className="text-6xl mb-4">🐣</div>
                    <h1 className="tp-h1-bold" style={{ color: 'var(--tp-primary-700)' }}>
                        歡迎來到手雞城市
                    </h1>
                    <p className="tp-body-regular" style={{ color: 'var(--tp-grayscale-600)' }}>
                        給你的寵物取個名字，開始你的健身之旅！
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label
                            className="tp-body-semibold block mb-2"
                            style={{ color: 'var(--tp-grayscale-700)' }}
                        >
                            寵物名稱
                        </label>
                        <Input
                            placeholder="例如：咕咕雞"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isLoading) {
                                    handleCreateUser();
                                }
                            }}
                            disabled={isLoading}
                            className="w-full"
                        />
                    </div>

                    <Button
                        onClick={handleCreateUser}
                        disabled={isLoading}
                        className="w-full"
                        style={{
                            backgroundColor: 'var(--tp-primary-600)',
                            color: 'var(--tp-white)',
                        }}
                    >
                        {isLoading ? "創建中..." : "開始冒險"}
                    </Button>
                </div>

                <div className="text-center">
                    <p className="tp-caption" style={{ color: 'var(--tp-grayscale-500)' }}>
                        運動讓你的寵物變得更強壯！💪
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Welcome;
