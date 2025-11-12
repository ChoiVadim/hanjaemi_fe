export interface TopikQuestion {
  id: number;
  type: 'vocabulary' | 'grammar' | 'reading_comprehension' | 'inference' | 'main_idea';
  level: 'beginner' | 'intermediate' | 'advanced';
  passage?: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 index
  explanation: string;
  tip: string;
}

export const topikReadingQuestions: TopikQuestion[] = [
  // Vocabulary Questions (1-10)
  {
    id: 1,
    type: 'vocabulary',
    level: 'beginner',
    question: '빈칸에 들어갈 말로 가장 알맞은 것을 고르십시오.\n\n감기약을 ____ 열이 내렸다.',
    options: ['먹느라고', '먹더라도', '먹을 텐데', '먹고 나서'],
    correctAnswer: 0,
    explanation: '문맥상 감기약을 복용한 결과로 열이 내렸다는 의미입니다. 즉 약을 먹어서 열이 내렸다는 원인과 결과 관계를 나타냅니다.',
    tip: '문장에서 원인과 결과를 묻는 표현을 찾아보세요. 약을 먹은 결과로 열이 내렸음을 표현하는 답이 적절합니다.'
  },
  {
    id: 2,
    type: 'vocabulary',
    level: 'beginner',
    question: '빈칸에 들어갈 말로 가장 알맞은 것을 고르십시오.\n\n내일 김밥을 만들려고 재료를 미리 ______.',
    options: ['준비해 놓았다', '준비하곤 했다', '준비하면 된다', '준비하는 법이다'],
    correctAnswer: 0,
    explanation: '문맥상 "재료를 미리 준비해 놓았다"는 내일 김밥을 만들기 위해 사전에 재료를 준비해 둔 상태를 뜻하므로 적절한 표현입니다.',
    tip: '문맥에서 계획이나 준비를 나타내는 표현을 찾으세요. "미리 준비해 놓았다"와 같은 표현이 자연스럽습니다.'
  },
  {
    id: 3,
    type: 'vocabulary',
    level: 'intermediate',
    question: '다음 중 굵게 표시된 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n그는 항상 **성실하게** 일합니다.',
    options: ['게으르게', '열심히', '빠르게', '조심스럽게'],
    correctAnswer: 1,
    explanation: '"성실하게"는 책임감 있고 열심히 하는 것을 의미합니다.',
    tip: 'Look for character/attitude words. "성실하게" means diligently/earnestly.'
  },
  {
    id: 4,
    type: 'vocabulary',
    level: 'intermediate',
    question: '다음 중 굵게 표시된 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n회의가 **연기되었습니다**.',
    options: ['시작되었습니다', '끝났습니다', '미뤄졌습니다', '취소되었습니다'],
    correctAnswer: 2,
    explanation: '"연기되다"는 예정된 일을 나중으로 미루는 것을 의미합니다.',
    tip: 'Focus on action/schedule words. "연기되다" means postponed/delayed.'
  },
  {
    id: 5,
    type: 'vocabulary',
    level: 'advanced',
    question: '다음 중 굵게 표시된 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n그의 주장은 매우 **타당합니다.**',
    options: ['복잡합니다', '합리적입니다', '어렵습니다', '새롭습니다'],
    correctAnswer: 1,
    explanation: '"타당하다"는 논리적이고 합리적이라는 의미입니다.',
    tip: 'Look for logic/reasoning words. "타당하다" means reasonable/valid.'
  },

  // Grammar Questions (6-15)
  {
    id: 6,
    type: 'grammar',
    level: 'beginner',
    question: '다음 빈칸에 들어갈 가장 알맞은 것을 고르십시오.\n\n저는 한국어를 _____ 있습니다.',
    options: ['배우고', '배우는', '배웠고', '배울'],
    correctAnswer: 0,
    explanation: '현재 진행 중인 동작을 나타낼 때 "-고 있다"를 사용합니다.',
    tip: 'Look for continuous action markers. "-고 있다" indicates ongoing action.'
  },
  {
    id: 7,
    type: 'grammar',
    level: 'beginner',
    question: '다음 빈칸에 들어갈 가장 알맞은 것을 고르십시오.\n\n내일 비가 _____ 소풍을 가지 못할 것 같습니다.',
    options: ['오면', '와서', '오니까', '오는데'],
    correctAnswer: 0,
    explanation: '가정 상황을 나타낼 때 "-면"을 사용합니다.',
    tip: 'Look for conditional situations. "-면" indicates "if" conditions.'
  },
  {
    id: 8,
    type: 'grammar',
    level: 'intermediate',
    question: '다음 빈칸에 들어갈 가장 알맞은 것을 고르십시오.\n\n아무리 바빠도 건강을 _____ 안 됩니다.',
    options: ['소홀히 하면', '소홀히 해도', '소홀히 하니까', '소홀히 해서'],
    correctAnswer: 0,
    explanation: '금지나 불가능을 나타낼 때 "-면 안 되다"를 사용합니다.',
    tip: 'Look for prohibition patterns. "-면 안 되다" means "should not/must not".'
  },

  // Reading Comprehension Questions (9-30)
  {
    id: 9,
    type: 'reading_comprehension',
    level: 'beginner',
    passage: '민수는 매일 아침 7시에 일어납니다. 아침을 먹고 8시에 집에서 나갑니다. 회사까지 지하철로 30분이 걸립니다. 민수는 9시부터 6시까지 일합니다.',
    question: '민수는 언제 회사에 도착합니까?',
    options: ['8시', '8시 30분', '9시', '7시 30분'],
    correctAnswer: 1,
    explanation: '8시에 집에서 나가서 지하철로 30분이 걸리므로 8시 30분에 도착합니다.',
    tip: 'Calculate time by adding travel duration to departure time.'
  },
  {
    id: 10,
    type: 'reading_comprehension',
    level: 'intermediate',
    passage: '한국의 전통 음식인 김치는 배추, 무, 오이 등의 채소를 소금에 절인 후 고춧가루, 마늘, 생강 등의 양념을 넣어 발효시킨 음식입니다. 김치는 비타민과 유산균이 풍부해서 건강에 좋습니다.',
    question: '이 글의 내용으로 맞는 것은?',
    options: ['김치는 고기로 만든다', '김치는 발효 음식이다', '김치는 단맛이 난다', '김치는 외국 음식이다'],
    correctAnswer: 1,
    explanation: '글에서 김치를 "발효시킨 음식"이라고 명시하고 있습니다.',
    tip: 'Look for key descriptive words about the main subject.'
  },

  // Continue with more questions...
  {
    id: 11,
    type: 'reading_comprehension',
    level: 'intermediate',
    passage: '요즘 젊은이들 사이에서 홈카페가 인기입니다. 홈카페란 집에서 카페처럼 커피를 만들어 마시는 것을 말합니다. 비싼 카페 대신 집에서 좋은 커피를 마실 수 있어서 경제적입니다.',
    question: '홈카페의 장점은 무엇입니까?',
    options: ['맛이 좋다', '시간이 절약된다', '경제적이다', '친구를 만날 수 있다'],
    correctAnswer: 2,
    explanation: '글에서 "경제적입니다"라고 홈카페의 장점을 명시하고 있습니다.',
    tip: 'Look for advantage/benefit keywords like "경제적", "좋다", "편리하다".'
  },
  {
    id: 12,
    type: 'inference',
    level: 'advanced',
    passage: '최근 연구에 따르면 스마트폰 사용 시간이 늘어날수록 수면의 질이 떨어진다고 합니다. 특히 잠자리에 들기 전 스마트폰을 사용하면 뇌가 각성 상태를 유지해서 잠들기 어려워집니다.',
    question: '이 글을 통해 알 수 있는 것은?',
    options: ['스마트폰이 건강에 좋다', '잠자기 전 스마트폰 사용을 피해야 한다', '스마트폰 사용 시간은 중요하지 않다', '수면 시간을 늘려야 한다'],
    correctAnswer: 1,
    explanation: '스마트폰 사용이 수면에 부정적 영향을 준다는 내용으로 보아 잠자기 전 사용을 피해야 함을 추론할 수 있습니다.',
    tip: 'Look for cause-effect relationships and draw logical conclusions.'
  },

  // Main Idea Questions (13-20)
  {
    id: 13,
    type: 'main_idea',
    level: 'intermediate',
    passage: '환경 보호를 위해 많은 사람들이 플라스틱 사용을 줄이려고 노력하고 있습니다. 일회용 컵 대신 텀블러를 사용하고, 비닐봉지 대신 장바구니를 사용합니다. 작은 실천이지만 지구 환경을 지키는 데 큰 도움이 됩니다.',
    question: '이 글의 주요 내용은 무엇입니까?',
    options: ['플라스틱의 장점', '환경 보호 실천 방법', '일회용품의 편리함', '쇼핑의 즐거움'],
    correctAnswer: 1,
    explanation: '글 전체가 환경 보호를 위한 구체적인 실천 방법들을 소개하고 있습니다.',
    tip: 'Identify the central theme that connects all examples and details.'
  },

  // Add more questions to reach 50 total
  {
    id: 14,
    type: 'vocabulary',
    level: 'beginner',
    question: '다음 중 굵게 표시된 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n오늘 날씨가 매우 **춥습니다.**',
    options: ['따뜻합니다', '시원합니다', '차갑습니다', '뜨겁습니다'],
    correctAnswer: 2,
    explanation: '"춥다"는 온도가 낮아서 차가운 상태를 의미합니다.',
    tip: 'Focus on temperature-related words. "춥다" means cold.'
  },
  {
    id: 15,
    type: 'grammar',
    level: 'intermediate',
    question: '다음 빈칸에 들어갈 가장 알맞은 것을 고르십시오.\n\n시험이 어려웠_____ 열심히 공부했습니다.',
    options: ['지만', '어서', '니까', '면서'],
    correctAnswer: 0,
    explanation: '대조를 나타내는 연결어미 "-지만"이 적절합니다.',
    tip: 'Look for contrast markers. "-지만" indicates "but/however".'
  },

  // Continue adding more questions...
  // For brevity, I'll add a few more representative questions
  {
    id: 16,
    type: 'reading_comprehension',
    level: 'advanced',
    passage: '인공지능 기술의 발달로 많은 직업이 변화하고 있습니다. 단순 반복 작업은 기계가 대신하게 되면서 창의적 사고와 인간적 소통이 중요한 능력으로 부각되고 있습니다. 미래 사회에서는 평생 학습이 필수가 될 것입니다.',
    question: '이 글에서 강조하는 미래 사회의 특징은?',
    options: ['기계의 완전한 대체', '단순 작업의 중요성', '평생 학습의 필요성', '인공지능의 한계'],
    correctAnswer: 2,
    explanation: '글의 마지막 문장에서 "평생 학습이 필수가 될 것"이라고 강조하고 있습니다.',
    tip: 'Pay attention to concluding statements that emphasize main points.'
  },

  // Add more questions to reach 50...
  // I'll create a representative sample and indicate where more would be added
  {
    id: 17,
    type: 'inference',
    level: 'intermediate',
    passage: '수진이는 매일 아침 일찍 일어나서 조깅을 합니다. 건강한 아침식사를 먹고 비타민도 챙겨 먹습니다. 주말에는 등산이나 수영을 즐깁니다.',
    question: '수진이에 대해 알 수 있는 것은?',
    options: ['게으른 성격이다', '건강 관리에 신경 쓴다', '운동을 싫어한다', '아침을 거르는 편이다'],
    correctAnswer: 1,
    explanation: '규칙적인 운동, 건강한 식사, 비타민 섭취 등으로 보아 건강 관리에 신경 쓴다고 추론할 수 있습니다.',
    tip: 'Look for patterns in behavior to infer character traits or habits.'
  },

  // ... Continue with questions 18-50
  // For the demo, I'll add a few more key examples

  {
    id: 18,
    type: 'main_idea',
    level: 'advanced',
    passage: '한국의 K-pop이 전 세계적으로 인기를 얻으면서 한국어 학습자도 크게 늘었습니다. 음악을 통해 자연스럽게 한국 문화를 접하게 되고, 언어에 대한 관심도 높아집니다. 이는 문화 콘텐츠가 언어 교육에 미치는 긍정적 영향을 보여주는 사례입니다.',
    question: '이 글의 핵심 내용은?',
    options: ['K-pop의 음악적 특징', '문화 콘텐츠의 교육적 효과', '한국어의 언어적 특성', '전 세계 음악 시장의 변화'],
    correctAnswer: 1,
    explanation: 'K-pop을 통한 한국어 학습 증가 현상을 통해 문화 콘텐츠의 교육적 효과를 설명하고 있습니다.',
    tip: 'Identify the broader concept that the specific example illustrates.'
  },

  // Sample questions 19-50 would continue here with similar patterns
  // covering all question types and difficulty levels
  {
    id: 19,
    type: 'vocabulary',
    level: 'advanced',
    question: '다음 중 굵게 표시된 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n이 문제는 매우 **복잡해서** 해결하기 어렵습니다.',
    options: ['간단합니다', '명확합니다', '까다롭습니다', '쉽습니다'],
    correctAnswer: 2,
    explanation: '"복잡하다"는 여러 요소가 얽혀 있어 어렵다는 의미로 "까다롭다"와 비슷합니다.',
    tip: 'Look for difficulty/complexity indicators. "복잡하다" means complicated/complex.'
  },

  {
    id: 20,
    type: 'reading_comprehension',
    level: 'advanced',
    passage: '최근 원격근무가 확산되면서 업무 환경이 크게 변화했습니다. 통근 시간이 줄어들고 업무 효율성이 높아지는 장점이 있지만, 동료와의 소통 부족과 업무와 사생활의 경계가 모호해지는 문제점도 나타나고 있습니다.',
    question: '원격근무의 문제점으로 언급된 것은?',
    options: ['통근 시간 증가', '업무 효율성 저하', '소통 부족', '비용 증가'],
    correctAnswer: 2,
    explanation: '글에서 원격근무의 문제점으로 "동료와의 소통 부족"을 명시하고 있습니다.',
    tip: 'Distinguish between advantages (장점) and disadvantages (문제점/단점).'
  },

  // Additional questions 21-50
  {
    id: 21,
    type: 'vocabulary',
    level: 'beginner',
    question: '다음 중 굵게 표시된 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n오늘은 날씨가 매우 **화창합니다.**',
    options: ['흐립니다', '맑습니다', '춥습니다', '비가 옵니다'],
    correctAnswer: 1,
    explanation: '"화창하다"는 하늘이 맑고 햇볕이 좋은 상태를 의미합니다.',
    tip: 'Weather vocabulary: "화창하다" indicates clear/sunny weather.'
  },
  {
    id: 22,
    type: 'grammar',
    level: 'beginner',
    question: '다음 빈칸에 들어갈 가장 알맞은 것을 고르십시오.\n\n저는 어제 친구를 만나____ 이야기를 많이 했습니다.',
    options: ['고', '서', '면', '는데'],
    correctAnswer: 0,
    explanation: '문맥상 과거의 두 행동을 연결할 때 "만나고 이야기를 했다"와 같이 "-고"를 사용합니다.',
    tip: 'Connective particles: "-고" links verbs to show sequence or additional actions.'
  },
  {
    id: 23,
    type: 'reading_comprehension',
    level: 'intermediate',
    passage: '도서관은 오전 9시에 문을 열고 오후 6시에 문을 닫습니다. 이용자는 입장 시 학생증을 제시해야 하며, 좌석은 선착순으로 배정됩니다.',
    question: '도서관에 들어가려면 무엇을 해야 합니까?',
    options: ['예약을 한다', '학생증을 제시한다', '요금을 지불한다', '회원 가입을 한다'],
    correctAnswer: 1,
    explanation: '글에서 "입장 시 학생증을 제시해야" 한다고 명시하고 있습니다.',
    tip: 'Look for required items or procedures mentioned explicitly.'
  },
  {
    id: 24,
    type: 'inference',
    level: 'intermediate',
    passage: '지현이는 매주 토요일 농구 모임에 참가합니다. 평일에는 회사에서 일하고 저녁에는 운동을 합니다. 건강을 위해 규칙적으로 운동하려고 노력합니다.',
    question: '지현이에 대해 추론할 수 있는 것은?',
    options: ['운동을 싫어한다', '건강을 신경 쓴다', '주말에 쉬기만 한다', '운동을 전혀 하지 않는다'],
    correctAnswer: 1,
    explanation: '규칙적인 운동과 모임 참가로 보아 지현이는 건강을 신경 쓴다고 추론할 수 있습니다.',
    tip: '행동의 빈도와 목적에서 성향을 추론하세요.'
  },
  {
    id: 25,
    type: 'main_idea',
    level: 'advanced',
    passage: '기후 변화로 인해 농작물의 생산 패턴이 바뀌고 있습니다. 일부 지역에서는 수확기가 앞당겨지고, 다른 지역에서는 가뭄으로 작황이 줄어들고 있습니다. 농업 기술과 정책적 대응이 시급합니다.',
    question: '이 글의 주된 내용은 무엇입니까?',
    options: ['농작물의 영양소', '기후 변화가 농업에 미치는 영향', '농업의 역사', '수확 방법'],
    correctAnswer: 1,
    explanation: '글은 기후 변화로 인한 농업 영향과 대응 필요성을 다루고 있습니다.',
    tip: '주제 문장을 찾아 전체 문단의 중심 내용을 파악하세요.'
  },
  {
    id: 26,
    type: 'vocabulary',
    level: 'intermediate',
    question: '다음 중 굵게 표시된 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n그는 항상 **겸손한** 태도를 유지한다.',
    options: ['자만한다', '겸손하다', '거만하다', '무례하다'],
    correctAnswer: 1,
    explanation: '"겸손하다"는 자신을 낮추고 예의를 지키는 태도를 말합니다.',
    tip: 'Personality adjectives: 비교되는 단어들의 의미를 구분하세요.'
  },
  {
    id: 27,
    type: 'grammar',
    level: 'intermediate',
    question: '다음 빈칸에 들어갈 가장 알맞은 것을 고르십시오.\n\n비가 오면 경기가 취소____ 수 있습니다.',
    options: ['된다', '될', '될까', '되는'],
    correctAnswer: 1,
    explanation: '가능성을 표현할 때 "취소될 수 있습니다"와 같이 사용합니다.',
    tip: '가능성 표현과 존댓말 형태를 확인하세요.'
  },
  {
    id: 28,
    type: 'reading_comprehension',
    level: 'beginner',
    passage: '유치원에서는 오전 9시에 모여서 동요를 부르고 간단한 체조를 합니다. 점심시간은 12시이고 낮잠 시간은 오후 1시입니다.',
    question: '유치원의 점심시간은 언제입니까?',
    options: ['오전 9시', '오후 1시', '정오 12시', '오전 11시'],
    correctAnswer: 2,
    explanation: '글에서 점심시간은 12시라고 명시하고 있습니다.',
    tip: '시간 관련 정보를 찾을 때는 문장에서 직접적으로 언급된 숫자를 확인하세요.'
  },
  {
    id: 29,
    type: 'inference',
    level: 'advanced',
    passage: '최근 스타트업들이 원자재 가격 상승과 인력 확보 문제로 사업 전략을 재검토하고 있습니다. 일부 기업은 자동화를 도입해 비용을 절감하려는 움직임을 보이고 있습니다.',
    question: '이 글에서 기업들이 고려하고 있는 해결책은 무엇입니까?',
    options: ['원자재 수입 중단', '자동화 도입', '인력 감축만', '마케팅 확대'],
    correctAnswer: 1,
    explanation: '글에서 일부 기업이 자동화를 도입해 비용을 절감하려 한다고 명시하고 있습니다.',
    tip: '문장에서 제시된 행동이 문제에 대한 대응임을 파악하세요.'
  },
  {
    id: 30,
    type: 'main_idea',
    level: 'intermediate',
    passage: '지역 커뮤니티가 활성화되면 주민 간의 유대가 강화되고 소규모 프로젝트가 성공적으로 진행될 가능성이 높아집니다. 지역 경제와 삶의 질 향상에 기여합니다.',
    question: '글의 주요 내용은 무엇입니까?',
    options: ['지역 경제 문제', '커뮤니티 활성화의 장점', '도시 개발 계획', '교통 혼잡 해결'],
    correctAnswer: 1,
    explanation: '글은 커뮤니티 활성화가 가져오는 장점을 설명하고 있습니다.',
    tip: '요지 파악: 문단이 전달하려는 긍정적 결과를 찾으세요.'
  },
  {
    id: 31,
    type: 'vocabulary',
    level: 'advanced',
    question: '다음 중 굵게 표시된 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n그의 의견은 **일관성**이 있다.',
    options: ['모순된다', '일치한다', '혼란스럽다', '불규칙하다'],
    correctAnswer: 1,
    explanation: '"일관성"은 말이나 행동이 서로 모순되지 않고 한 방향으로 유지되는 것을 의미합니다.',
    tip: '유사어와 반의어를 떠올려 의미를 비교하세요.'
  },
  {
    id: 32,
    type: 'grammar',
    level: 'advanced',
    question: '다음 문장에서 틀린 부분을 고르십시오.\n\n그는 내일 여행을 갈 것이다, 그래서 준비를 하고 있다.',
    options: ['그는', '내일', '갈 것이다,', '준비를 하고 있다'],
    correctAnswer: 2,
    explanation: '쉼표 사용이 부적절합니다. 연결어미나 마침표로 문장을 구분해야 합니다.',
    tip: '문장 부호와 연결을 자연스럽게 만드는 표현을 확인하세요.'
  },
  {
    id: 33,
    type: 'reading_comprehension',
    level: 'intermediate',
    passage: '박물관에서는 유물 보호를 위해 사진 촬영 시 플래시 사용을 금지하고 있습니다. 방문객은 안내 표지를 따라 주시기 바랍니다.',
    question: '방문객이 지켜야 할 규칙은 무엇입니까?',
    options: ['음식 섭취 가능', '플래시 사용 금지', '야간 개장', '자유 촬영 허용'],
    correctAnswer: 1,
    explanation: '글에서 플래시 사용 금지를 명확히 안내하고 있습니다.',
    tip: '규칙이나 금지 사항은 보통 명령형 문장에서 표현됩니다.'
  },
  {
    id: 34,
    type: 'inference',
    level: 'beginner',
    passage: '수업이 끝난 뒤 학생들은 교실을 정리하고 쓰레기를 분리수거했습니다. 모두가 협력하여 청결을 유지하려고 노력했습니다.',
    question: '학생들의 태도로 알맞은 것은?',
    options: ['무관심하다', '협력적이다', '게으르다', '비협조적이다'],
    correctAnswer: 1,
    explanation: '학생들이 함께 정리하고 분리수거를 했다는 점에서 협력적이라고 볼 수 있습니다.',
    tip: '행동 묘사를 통해 태도를 추론하세요.'
  },
  {
    id: 35,
    type: 'main_idea',
    level: 'advanced',
    passage: '기술 혁신은 생산성 향상뿐만 아니라 사회 구조의 변화를 촉발합니다. 기술이 노동의 성격을 바꾸고, 교육과 정책의 재편성을 요구합니다.',
    question: '이 문단이 강조하는 바는 무엇입니까?',
    options: ['단순한 생산성 향상', '기술 혁신과 사회적 영향', '역사적 사건', '소비 패턴'],
    correctAnswer: 1,
    explanation: '문단은 기술 혁신이 사회구조와 교육·정책에 미치는 영향을 강조합니다.',
    tip: '핵심 문장을 통해 전체 논지를 파악하세요.'
  },
  {
    id: 36,
    type: 'vocabulary',
    level: 'intermediate',
    question: '다음 중 굵게 표시된 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n그는 항상 **조심스럽게** 운전한다.',
    options: ['부주의하게', '신중하게', '급하게', '무모하게'],
    correctAnswer: 1,
    explanation: '"조심스럽게"는 행동을 신중히 하는 태도를 의미합니다.',
    tip: '행동을 수식하는 부사들의 의미를 비교하세요.'
  },
  {
    id: 37,
    type: 'grammar',
    level: 'beginner',
    question: '다음 빈칸에 들어갈 가장 알맞은 것을 고르십시오.\n\n저는 한국어를 공부____ 좋아합니다.',
    options: ['하러', '한테', '하기', '해서'],
    correctAnswer: 2,
    explanation: '"공부하기 좋아합니다"가 자연스러운 표현입니다.',
    tip: '동사 + 하기 형태는 명사화하여 선호를 표현할 수 있습니다.'
  },
  {
    id: 38,
    type: 'reading_comprehension',
    level: 'advanced',
    passage: '환경 단체는 해양 오염을 줄이기 위해 플라스틱 사용을 줄이고 재활용을 촉진하는 캠페인을 벌이고 있습니다. 시민 참여가 핵심입니다.',
    question: '환경 단체가 강조하는 핵심은 무엇입니까?',
    options: ['시민 참여', '원자재 수입', '산업 확장', '관광 활성화'],
    correctAnswer: 0,
    explanation: '글에서 시민 참여가 핵심이라고 명시하고 있습니다.',
    tip: '조직의 목표나 주장을 찾을 때는 마지막 문장을 확인하세요.'
  },
  {
    id: 39,
    type: 'inference',
    level: 'intermediate',
    passage: '회사에서는 매달 월례 회의를 통해 진행 상황을 공유하고 팀 간 협업을 촉진합니다. 회의 후에는 실행 항목이 정해지고 담당자가 지정됩니다.',
    question: '이 조직의 특징으로 알맞은 것은?',
    options: ['비체계적이다', '협업을 강조한다', '회의를 하지 않는다', '권한이 분산되어 있지 않다'],
    correctAnswer: 1,
    explanation: '정기 회의와 실행 항목 지정으로 보아 협업을 강조하는 조직입니다.',
    tip: '행동 패턴에서 조직 문화나 우선순위를 유추하세요.'
  },
  {
    id: 40,
    type: 'main_idea',
    level: 'beginner',
    passage: '건강한 식습관은 균형 잡힌 영양 섭취와 규칙적인 운동으로 이루어집니다. 작은 변화가 큰 차이를 만듭니다.',
    question: '이 글의 중심 내용은 무엇입니까?',
    options: ['약 복용법', '건강한 식습관의 중요성', '수면의 양', '요리 방법'],
    correctAnswer: 1,
    explanation: '글은 건강한 식습관과 운동의 중요성을 언급하고 있습니다.',
    tip: '중심 내용은 보통 문장의 첫부분이나 마지막 부분에 요약되어 있습니다.'
  },
  {
    id: 41,
    type: 'vocabulary',
    level: 'beginner',
    question: '다음 중 굵게 표시된 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n이 숙제는 너무 **간단합니다**.',
    options: ['어렵다', '복잡하다', '간단하다', '모호하다'],
    correctAnswer: 2,
    explanation: '"간단하다"는 복잡하지 않고 쉬운 상태를 의미합니다.',
    tip: '형용사의 반의어를 떠올려 비교하세요.'
  },
  {
    id: 42,
    type: 'grammar',
    level: 'intermediate',
    question: '다음 빈칸에 들어갈 가장 알맞은 것을 고르십시오.\n\n그가 제안한 방법은 실용적____ 효율적이다.',
    options: ['이지만', '이고', '이라서', '보다'],
    correctAnswer: 1,
    explanation: '두 형용사를 연결할 때 "이고"를 사용하여 병렬로 나열합니다.',
    tip: '형용사 연결에 맞는 접속사를 확인하세요.'
  },
  {
    id: 43,
    type: 'reading_comprehension',
    level: 'intermediate',
    passage: '마트에서는 신선한 과일과 채소를 저렴한 가격에 판매하며 주말 세일을 진행합니다. 고객은 쿠폰을 사용해 추가 할인을 받을 수 있습니다.',
    question: '마트에서 추가 할인을 받으려면 무엇을 사용해야 합니까?',
    options: ['회원 카드를 등록한다', '쿠폰을 사용한다', '현금만 사용한다', '배달 서비스를 이용한다'],
    correctAnswer: 1,
    explanation: '글에서 고객이 쿠폰을 사용해 추가 할인을 받을 수 있다고 했습니다.',
    tip: '할인 방법이나 조건은 문장에서 직접 언급됩니다.'
  },
  {
    id: 44,
    type: 'inference',
    level: 'advanced',
    passage: '어느 도시의 공원 계획은 도시민의 휴식과 생태 복원을 목표로 합니다. 계획에는 산책로 확충, 토종 식물 복원, 그리고 지역 프로그램 운영이 포함됩니다.',
    question: '계획의 주된 목적은 무엇입니까?',
    options: ['상업 개발', '교통 확장', '주민 휴식과 생태 복원', '산업 유치'],
    correctAnswer: 2,
    explanation: '문장에서 공원 계획의 목적을 명확히 제시하고 있습니다.',
    tip: '계획의 구성 요소들이 목표를 보여주므로 종합적으로 파악하세요.'
  },
  {
    id: 45,
    type: 'main_idea',
    level: 'advanced',
    passage: '교육 접근성 향상은 사회적 평등을 증진시키는 중요한 수단입니다. 온라인 교육 플랫폼과 장학제도는 교육 기회를 넓히는 데 기여합니다.',
    question: '글의 핵심 주장은 무엇입니까?',
    options: ['교육은 비용이 많이 든다', '교육 접근성 향상이 사회적 평등에 기여한다', '온라인 플랫폼은 해롭다', '장학금은 불필요하다'],
    correctAnswer: 1,
    explanation: '글은 교육 접근성 향상이 사회적 평등을 증진한다고 주장합니다.',
    tip: '제시된 해결책과 그 효과를 연결지어 주장을 파악하세요.'
  },
  {
    id: 46,
    type: 'vocabulary',
    level: 'intermediate',
    question: '다음 중 굵게 표시된 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n그는 항상 **성실하게** 업무를 처리한다.',
    options: ['부정직하게', '정직하게', '서투르게', '처리하지 않는다'],
    correctAnswer: 1,
    explanation: '"성실하게"는 책임감 있고 정직하게 행동하는 것을 의미합니다.',
    tip: '문맥에서 긍정적/부정적 의미를 파악하세요.'
  },
  {
    id: 47,
    type: 'grammar',
    level: 'advanced',
    question: '다음 중 올바른 문장 부호 사용은 어느 것입니까?\n\n가: "오늘 회의는 연기되었습니다." 나: "오늘 회의는 연기되었습니다!"',
    options: ['가', '나', '둘 다', '둘 다 아님'],
    correctAnswer: 0,
    explanation: '일반 보고 문장에는 마침표가 적절하며 감탄문이 아니라면 느낌표는 부적절합니다.',
    tip: '문장의 의도(평서 vs 감탄)를 고려해 부호를 선택하세요.'
  },
  {
    id: 48,
    type: 'reading_comprehension',
    level: 'intermediate',
    passage: '지역 축제는 관광객 유치와 지역 상권 활성화에 긍정적인 영향을 미칩니다. 주민 자원 봉사로 운영되며 지역 문화 홍보에도 기여합니다.',
    question: '지역 축제가 지역에 미치는 영향으로 적절한 것은?',
    options: ['상권 악화', '관광객 감소', '지역 상권 활성화', '지역 문화 억제'],
    correctAnswer: 2,
    explanation: '글에서 지역 축제가 상권 활성화와 관광객 유치에 긍정적이라고 했습니다.',
    tip: '긍정/부정 효과를 문장에서 찾아 구분하세요.'
  },
  {
    id: 49,
    type: 'inference',
    level: 'beginner',
    passage: '철수는 매일 자전거로 출근합니다. 날씨가 좋을 때는 더욱 기분이 좋아진다고 합니다.',
    question: '철수의 출근 방법은 무엇인가요?',
    options: ['버스', '택시', '자전거', '도보'],
    correctAnswer: 2,
    explanation: '문장에서 철수는 매일 자전거로 출근한다고 명시되어 있습니다.',
    tip: '직접적으로 언급된 행동을 선택하세요.'
  },
  {
    id: 50,
    type: 'main_idea',
    level: 'advanced',
    passage: '지속 가능한 발전은 환경 보호, 경제 성장, 사회적 형평성의 균형을 필요로 합니다. 단기 이득만을 추구하면 장기적으로 부작용이 발생할 수 있습니다.',
    question: '글의 핵심 주제는 무엇입니까?',
    options: ['단기 이득의 중요성', '지속 가능한 발전의 필요성', '환경만의 중요성', '경제 성장만 강조'],
    correctAnswer: 1,
    explanation: '글은 지속 가능한 발전을 위해 균형 있는 접근이 필요하다고 말합니다.',
    tip: '글의 경고나 권고를 통해 중심 주제를 파악하세요.'
  },

  // Continue pattern for remaining 30 questions...
  // Each would follow similar structure with varied content
];

// Helper function to get questions by type
export const getQuestionsByType = (type: TopikQuestion['type']) => {
  return topikReadingQuestions.filter(q => q.type === type);
};

// Helper function to get questions by level
export const getQuestionsByLevel = (level: TopikQuestion['level']) => {
  return topikReadingQuestions.filter(q => q.level === level);
};

// For demo purposes, I'm showing 20 questions. 
// In a real implementation, you would continue this pattern to reach 50 questions
// covering all types: vocabulary, grammar, reading_comprehension, inference, main_idea
// and all levels: beginner, intermediate, advanced
