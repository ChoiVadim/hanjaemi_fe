export interface TopikListeningQuestion {
  id: number;
  type: "conversation" | "announcement" | "news" | "lecture" | "interview";
  level: "beginner" | "intermediate" | "advanced";
  audioUrl: string; // URL to audio file
  audioScript?: string; // Optional transcript for reference
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 index
  explanation: string;
  tip: string;
  duration: number; // Audio duration in seconds
}

export const topikListeningQuestions: TopikListeningQuestion[] = [
  // Conversation Questions (1-10)
  {
    id: 1,
    type: "conversation",
    level: "beginner",
    audioUrl: "/audio/listening/conversation_01.mp3",
    audioScript:
      "남자: 실례합니다. 지하철역이 어디에 있습니까?\n여자: 저기 큰 건물 옆에 있어요.\n남자: 감사합니다.",
    question: "남자는 무엇을 찾고 있습니까?",
    options: ["버스 정류장", "지하철역", "은행", "병원"],
    correctAnswer: 1,
    explanation: '남자가 "지하철역이 어디에 있습니까?"라고 물어보았습니다.',
    tip: 'Listen for the key word the person is asking about. Focus on question words like "어디", "무엇", "언제".',
    duration: 8,
  },
  {
    id: 2,
    type: "conversation",
    level: "beginner",
    audioUrl: "/audio/listening/conversation_02.mp3",
    audioScript:
      "여자: 오늘 날씨가 정말 좋네요.\n남자: 네, 맞아요. 산책하기 좋은 날씨예요.\n여자: 그럼 공원에 갈까요?",
    question: "두 사람은 무엇을 하려고 합니까?",
    options: ["영화를 보다", "쇼핑을 하다", "산책을 하다", "음식을 먹다"],
    correctAnswer: 2,
    explanation:
      '남자가 "산책하기 좋은 날씨"라고 하고 여자가 "공원에 갈까요?"라고 제안했습니다.',
    tip: 'Pay attention to suggestions and plans. Look for words like "갈까요?", "할까요?" that indicate future actions.',
    duration: 10,
  },
  {
    id: 3,
    type: "conversation",
    level: "intermediate",
    audioUrl: "/audio/listening/conversation_03.mp3",
    audioScript:
      "남자: 이번 주말에 시간 있어요?\n여자: 토요일은 바쁘지만 일요일은 괜찮아요.\n남자: 그럼 일요일에 영화 볼까요?\n여자: 좋아요. 몇 시에 만날까요?",
    question: "두 사람은 언제 만날 예정입니까?",
    options: ["금요일", "토요일", "일요일", "월요일"],
    correctAnswer: 2,
    explanation:
      '여자가 "일요일은 괜찮다"고 하고 남자가 "일요일에 영화 볼까요?"라고 제안했습니다.',
    tip: "Focus on time expressions and scheduling. Listen for days of the week and time-related responses.",
    duration: 12,
  },

  // Announcement Questions (4-8)
  {
    id: 4,
    type: "announcement",
    level: "beginner",
    audioUrl: "/audio/listening/announcement_01.mp3",
    audioScript:
      "지하철 2호선을 이용하시는 승객 여러분께 안내 말씀드립니다. 현재 강남역에서 선로 점검으로 인해 열차 운행이 지연되고 있습니다.",
    question: "현재 어떤 문제가 발생했습니까?",
    options: ["열차 고장", "선로 점검", "승객 사고", "정전"],
    correctAnswer: 1,
    explanation:
      '안내방송에서 "선로 점검으로 인해 열차 운행이 지연되고 있다"고 했습니다.',
    tip: 'In announcements, listen for the reason (원인) introduced by words like "으로 인해", "때문에".',
    duration: 15,
  },
  {
    id: 5,
    type: "announcement",
    level: "intermediate",
    audioUrl: "/audio/listening/announcement_02.mp3",
    audioScript:
      "백화점을 이용해 주셔서 감사합니다. 현재 8층 레스토랑에서 특별 할인 행사를 진행하고 있습니다. 오후 6시까지 모든 메뉴 20% 할인됩니다.",
    question: "할인 행사는 언제까지입니까?",
    options: ["오후 5시", "오후 6시", "오후 7시", "오후 8시"],
    correctAnswer: 1,
    explanation:
      '안내방송에서 "오후 6시까지 모든 메뉴 20% 할인된다"고 했습니다.',
    tip: 'Listen for time limits with "까지" (until). Pay attention to specific times mentioned.',
    duration: 18,
  },

  // News Questions (6-10)
  {
    id: 6,
    type: "news",
    level: "intermediate",
    audioUrl: "/audio/listening/news_01.mp3",
    audioScript:
      "오늘 서울의 최고 기온은 28도, 최저 기온은 18도로 예상됩니다. 오후에는 구름이 많고 저녁에 비가 올 가능성이 있습니다.",
    question: "오늘 서울의 최고 기온은 몇 도입니까?",
    options: ["18도", "25도", "28도", "30도"],
    correctAnswer: 2,
    explanation: '뉴스에서 "서울의 최고 기온은 28도"라고 했습니다.',
    tip: "In weather reports, distinguish between 최고 기온 (highest) and 최저 기온 (lowest) temperatures.",
    duration: 20,
  },
  {
    id: 7,
    type: "news",
    level: "advanced",
    audioUrl: "/audio/listening/news_02.mp3",
    audioScript:
      "정부는 내년부터 대중교통 요금을 평균 10% 인상한다고 발표했습니다. 이는 물가 상승과 운영비 증가 때문입니다. 시민들의 반응은 엇갈리고 있습니다.",
    question: "대중교통 요금이 인상되는 이유는 무엇입니까?",
    options: [
      "승객 감소",
      "물가 상승과 운영비 증가",
      "새로운 시설 건설",
      "정부 정책 변화",
    ],
    correctAnswer: 1,
    explanation:
      '뉴스에서 "물가 상승과 운영비 증가 때문"이라고 이유를 명시했습니다.',
    tip: 'Look for cause-and-effect relationships. Listen for "때문에", "으로 인해" to identify reasons.',
    duration: 25,
  },

  // Lecture Questions (8-12)
  {
    id: 8,
    type: "lecture",
    level: "intermediate",
    audioUrl: "/audio/listening/lecture_01.mp3",
    audioScript:
      "한국의 전통 음식 김치는 배추를 소금에 절인 후 고춧가루, 마늘, 생강 등의 양념을 넣어 발효시킨 음식입니다. 김치는 비타민과 유산균이 풍부해서 건강에 매우 좋습니다.",
    question: "김치의 주재료는 무엇입니까?",
    options: ["무", "배추", "오이", "양파"],
    correctAnswer: 1,
    explanation:
      '강의에서 "배추를 소금에 절인 후"라고 김치의 주재료를 설명했습니다.',
    tip: "In lectures, pay attention to definitions and main ingredients introduced at the beginning.",
    duration: 30,
  },
  {
    id: 9,
    type: "lecture",
    level: "advanced",
    audioUrl: "/audio/listening/lecture_02.mp3",
    audioScript:
      "한국어의 높임법은 상대방의 나이, 지위, 친밀도에 따라 달라집니다. 존댓말과 반말로 구분되며, 동사와 형용사의 어미가 변화합니다. 이는 한국 사회의 위계질서를 반영합니다.",
    question: "한국어 높임법이 결정되는 기준이 아닌 것은?",
    options: ["나이", "지위", "친밀도", "거주지"],
    correctAnswer: 3,
    explanation:
      '강의에서 "나이, 지위, 친밀도에 따라 달라진다"고 했으며, 거주지는 언급되지 않았습니다.',
    tip: "Listen for lists of criteria or factors. Pay attention to what is NOT mentioned.",
    duration: 35,
  },

  // Interview Questions (10-15)
  {
    id: 10,
    type: "interview",
    level: "intermediate",
    audioUrl: "/audio/listening/interview_01.mp3",
    audioScript:
      "기자: 새 책을 출간하신 소감이 어떠세요?\n작가: 5년 동안 준비한 작품이라 감회가 새롭습니다. 독자들이 재미있게 읽어주셨으면 좋겠어요.",
    question: "작가는 이 책을 얼마나 오래 준비했습니까?",
    options: ["3년", "4년", "5년", "6년"],
    correctAnswer: 2,
    explanation: '작가가 "5년 동안 준비한 작품"이라고 답했습니다.',
    tip: "In interviews, focus on specific numbers and time periods mentioned by the interviewee.",
    duration: 15,
  },

  // Additional questions following the same pattern...
  {
    id: 11,
    type: "conversation",
    level: "advanced",
    audioUrl: "/audio/listening/conversation_04.mp3",
    audioScript:
      "남자: 회의 시간이 변경되었다고 들었는데요.\n여자: 네, 오후 2시에서 4시로 연기되었어요.\n남자: 그럼 점심 약속은 취소해야겠네요.",
    question: "회의는 언제로 변경되었습니까?",
    options: ["오후 1시", "오후 2시", "오후 3시", "오후 4시"],
    correctAnswer: 3,
    explanation: '여자가 "오후 2시에서 4시로 연기되었다"고 말했습니다.',
    tip: 'Listen for schedule changes. Pay attention to "에서...로" pattern indicating change from one time to another.',
    duration: 12,
  },
  {
    id: 12,
    type: "announcement",
    level: "advanced",
    audioUrl: "/audio/listening/announcement_03.mp3",
    audioScript:
      "도서관 이용자 여러분께 알려드립니다. 내일부터 3일간 시설 보수 공사로 인해 열람실 이용이 제한됩니다. 대출과 반납은 1층에서 가능합니다.",
    question: "열람실을 이용할 수 없는 기간은 며칠입니까?",
    options: ["1일", "2일", "3일", "4일"],
    correctAnswer: 2,
    explanation:
      '안내에서 "3일간 시설 보수 공사로 인해 열람실 이용이 제한된다"고 했습니다.',
    tip: 'Listen for duration expressions like "3일간", "일주일간". Focus on the specific time period mentioned.',
    duration: 20,
  },

  // Continue pattern for more questions...
  {
    id: 13,
    type: "news",
    level: "beginner",
    audioUrl: "/audio/listening/news_03.mp3",
    audioScript:
      "내일은 전국적으로 맑은 날씨가 예상됩니다. 기온은 평년보다 2도 높을 것으로 보입니다. 외출하기 좋은 날씨가 될 것 같습니다.",
    question: "내일 날씨는 어떻습니까?",
    options: ["비가 온다", "눈이 온다", "맑다", "흐리다"],
    correctAnswer: 2,
    explanation: '뉴스에서 "전국적으로 맑은 날씨가 예상된다"고 했습니다.',
    tip: 'Weather reports often start with the general condition. Listen for key weather words like "맑다", "흐리다", "비".',
    duration: 15,
  },
  {
    id: 14,
    type: "interview",
    level: "advanced",
    audioUrl: "/audio/listening/interview_02.mp3",
    audioScript:
      "기자: 올해 목표가 무엇인가요?\n운동선수: 세계 선수권 대회에서 메달을 따는 것이 목표입니다. 매일 6시간씩 훈련하고 있어요.",
    question: "운동선수는 하루에 몇 시간 훈련합니까?",
    options: ["4시간", "5시간", "6시간", "7시간"],
    correctAnswer: 2,
    explanation: '운동선수가 "매일 6시간씩 훈련하고 있다"고 답했습니다.',
    tip: 'In interviews about routines, listen for frequency words like "매일", "하루에" and specific numbers.',
    duration: 18,
  },
  {
    id: 15,
    type: "lecture",
    level: "beginner",
    audioUrl: "/audio/listening/lecture_03.mp3",
    audioScript:
      "한국의 사계절은 봄, 여름, 가을, 겨울로 나뉩니다. 봄에는 꽃이 피고, 여름에는 덥고 습합니다. 가을에는 단풍이 아름답고, 겨울에는 춥고 눈이 옵니다.",
    question: "가을의 특징은 무엇입니까?",
    options: ["꽃이 핀다", "덥고 습하다", "단풍이 아름답다", "춥고 눈이 온다"],
    correctAnswer: 2,
    explanation: '강의에서 "가을에는 단풍이 아름답다"고 설명했습니다.',
    tip: "When listening to descriptions of seasons, match each season with its specific characteristics.",
    duration: 25,
  },

  // More questions would continue here following the same pattern
  // Each type (conversation, announcement, news, lecture, interview)
  // with different difficulty levels and realistic TOPIK content
  {
    id: 16,
    type: "conversation",
    level: "intermediate",
    audioUrl: "/audio/listening/conversation_05.mp3",
    audioScript:
      "여자: 저기 음식점이 맛있어 보이네요.\n남자: 그런데 사람이 너무 많아요. 다른 곳으로 갈까요?\n여자: 네, 좋아요. 조용한 곳으로 가요.",
    question: "두 사람이 다른 음식점을 찾는 이유는 무엇입니까?",
    options: [
      "음식이 맛없어서",
      "가격이 비싸서",
      "사람이 많아서",
      "문이 닫혀서",
    ],
    correctAnswer: 2,
    explanation:
      '남자가 "사람이 너무 많다"고 해서 다른 곳으로 가자고 제안했습니다.',
    tip: "Listen for problems or reasons for changing plans. Focus on negative expressions and suggestions.",
    duration: 10,
  },
  {
    id: 17,
    type: "announcement",
    level: "intermediate",
    audioUrl: "/audio/listening/announcement_04.mp3",
    audioScript:
      "승객 여러분께 안내드립니다. 안전 점검으로 인해 엘리베이터 운행을 일시 중단합니다. 불편을 드려 죄송하며, 계단을 이용해 주시기 바랍니다.",
    question: "승객들은 어떻게 해야 합니까?",
    options: [
      "기다린다",
      "계단을 이용한다",
      "다른 건물로 간다",
      "엘리베이터를 탄다",
    ],
    correctAnswer: 1,
    explanation:
      '안내방송에서 "계단을 이용해 주시기 바랍니다"라고 요청했습니다.',
    tip: 'In announcements, listen for instructions or requests, often ending with "바랍니다", "주세요".',
    duration: 16,
  },
  {
    id: 18,
    type: "news",
    level: "advanced",
    audioUrl: "/audio/listening/news_04.mp3",
    audioScript:
      "최근 연구에 따르면 한국인의 평균 수명이 82세로 증가했습니다. 이는 의료 기술 발달과 건강 관리 의식 향상 덕분입니다. 전문가들은 앞으로 더 늘어날 것으로 예상한다고 밝혔습니다.",
    question: "한국인의 평균 수명이 증가한 이유는 무엇입니까?",
    options: [
      "경제 발전",
      "의료 기술 발달과 건강 관리 의식 향상",
      "환경 개선",
      "교육 수준 향상",
    ],
    correctAnswer: 1,
    explanation:
      '뉴스에서 "의료 기술 발달과 건강 관리 의식 향상 덕분"이라고 이유를 설명했습니다.',
    tip: 'Look for explanations introduced by "덕분에", "때문에". These indicate causes or reasons.',
    duration: 22,
  },
  {
    id: 19,
    type: "lecture",
    level: "advanced",
    audioUrl: "/audio/listening/lecture_04.mp3",
    audioScript:
      "한국의 전통 건축에서 처마는 매우 중요한 역할을 합니다. 비와 눈으로부터 건물을 보호하고, 여름에는 그늘을 만들어 줍니다. 또한 건물의 아름다움을 더해주는 장식적 기능도 있습니다.",
    question: "처마의 기능이 아닌 것은?",
    options: ["비와 눈으로부터 보호", "그늘 제공", "장식적 기능", "난방 효과"],
    correctAnswer: 3,
    explanation:
      "강의에서 보호, 그늘, 장식 기능을 언급했지만 난방 효과는 말하지 않았습니다.",
    tip: "When asked about functions, eliminate options that were not mentioned in the lecture.",
    duration: 28,
  },
  {
    id: 20,
    type: "interview",
    level: "beginner",
    audioUrl: "/audio/listening/interview_03.mp3",
    audioScript:
      "기자: 한국 생활은 어떠세요?\n외국인: 처음에는 어려웠지만 지금은 많이 익숙해졌어요. 한국 음식도 좋아하게 되었고요.\n기자: 가장 좋아하는 한국 음식은 뭐예요?\n외국인: 비빔밥이요.",
    question: "외국인이 가장 좋아하는 한국 음식은 무엇입니까?",
    options: ["김치", "불고기", "비빔밥", "냉면"],
    correctAnswer: 2,
    explanation: '외국인이 "비빔밥이요"라고 직접 답했습니다.',
    tip: "In interviews, listen for direct answers to specific questions. The answer often comes right after the question.",
    duration: 20,
  },
];

// Helper functions
export const getListeningQuestionsByType = (
  type: TopikListeningQuestion["type"]
) => {
  return topikListeningQuestions.filter((q) => q.type === type);
};

export const getListeningQuestionsByLevel = (
  level: TopikListeningQuestion["level"]
) => {
  return topikListeningQuestions.filter((q) => q.level === level);
};

// Note: In a real implementation, you would need actual audio files
// For demo purposes, these reference placeholder audio files
// You could use text-to-speech services or record actual Korean audio
