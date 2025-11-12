export interface TopikWritingQuestion {
    id: number;
    // Minimal required shape for the writing UI
    question: string;
    images?: string[];

    // Optional metadata
    type?: "conversation" | "announcement" | "news" | "lecture" | "interview";
    level?: "beginner" | "intermediate" | "advanced";
    audioUrl?: string; // URL to audio file
    audioScript?: string; // Optional transcript for reference
    // Options may be simple text strings or image options for visual questions.
    options?: Array<string | { src: string; alt?: string }>;
    correctAnswer?: number | string; // some entries use text answers
    goodAnswer?: string;
    explanation?: string;
    tip?: string;
    duration?: number; // Audio duration in seconds
}

export const topikWritingQuestions: TopikWritingQuestion[] = [
    // The following 30 items are populated from the user's provided listening prompt.
    // Audio URLs are placeholders; correctAnswer/explanation set to 0/"TBD" as placeholders
    // You can update correctAnswer and explanations as needed.
    {
        id: 1,
        type: "conversation",
        level: "beginner",
        question: "다음 글의 'ㄱ' 과 'ㄴ'에 알맞은 말을 각각 쓰시오",
        images: ["/public/images/writing/51.png"],
        goodAnswer: "ㄱ. 하려고 합니다 / 하고 싶습니다\n ㄴ. 동네가 좋을지/동네가 좋을지/곳으로 갈지",
    },

    {
        id: 2,
        type: "conversation",
        level: "beginner",
        question: "다음 글의 'ㄱ' 과 'ㄴ'에 알맞은 말을 각각 쓰시오",
        images: ["/public/images/writing/52.png"],
        goodAnswer: "ㄱ. 자는 것은 아니다 \n ㄴ. 못하기 때문이다 / 하지 못하기 때문이다.",
    },


    {
        id: 3,
        type: "conversation",
        level: "beginner",
        question: "다음은 '인주시 마라톤 대회 참가자 수의 변화'에 대한 자료이다. 이 내용을 200~300자의 글로 쓰시오. 단, 글의 제목은 쓰지 마시오.",
        images: ["/public/images/writing/54.png"],
        correctAnswer: "brief summary of how the answer should look like",
        goodAnswer: "한국스포츠연구소에서 인주시 마라톤 대회 참가자 수의 변화를 조사하였다.\n그 결과 인주시 마라톤 대회 참가자 수는 2013년 40만 명에서 2023년 100만 명으로 2.5배 증가한 것으로 나타났따. 이를 연령별로 살펴보면 20~30대는 지난 10년간 4배 증가한 반면 40~50대는 같은 기간에 1.3배 증가하는 데에 그쳤다. 이러한 변화의 원인은 건강 관리에 대한 관심이 높아져 다리기 문화가 확산되었고 SNS를 통한 마라톤 모임이 활성화되어 20~30대 참가자가 증가하였기 때문인 것으로 보인다.",
    },

    {
        id: 4,
        type: "conversation",
        level: "beginner",
        question: "다음을 참고하여 600~700자로 글을 쓰시오. 단, 문제를 그대로 옮겨 쓰지 마시오.",
        images: ["/public/images/writing/54.png"],
        correctAnswer: "brief summary of how the answer should look like",
        goodAnswer: "사회적 변화로 개인의 자율성을 중시하는 경향이 커지면서 기업들도 유연근무제를 도입하는 등 직장 내 자율성을 높이려는 노력을 기울이고 있다. 자율성이 보장되면 개인의 창의성이 발현되고 일과 삶의 균형을 맞추기 쉬워져 업무 효율이 개선될 수 있다. 그러나 지나친 개인주의는 협업과 소통의 부재를 초래하여 갈등을 야기할 수 있다. 이를 방지하려면 개인의 자율성과 조직의 목표를 조화시키는 정책과 효율적인 의사소통 체계를 마련해야 한다.",
    },

];

// Helper functions
export const getListeningQuestionsByType = (
    type: TopikWritingQuestion["type"]
) => {
    return topikWritingQuestions.filter((q) => q.type === type);
};

export const getListeningQuestionsByLevel = (
    level: TopikWritingQuestion["level"]
) => {
    return topikWritingQuestions.filter((q) => q.level === level);
};

// Note: In a real implementation, you would need actual audio files
// For demo purposes, these reference placeholder audio files
// You could use text-to-speech services or record actual Korean audio
