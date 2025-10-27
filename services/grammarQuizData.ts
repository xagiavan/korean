import type { QuizQuestion } from '../types';

export interface GrammarQuizCategory {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate';
  questions: QuizQuestion[];
}

export const grammarQuizData: GrammarQuizCategory[] = [
  {
    id: 'tobe',
    name: '"Là" (이에요/예요) và Danh từ',
    description: 'Kiểm tra cách dùng cấu trúc câu cơ bản nhất để giới thiệu sự vật, sự việc.',
    level: 'beginner',
    questions: [
      {
        question: 'Điền vào chỗ trống: "저는 베트남 사람___."',
        options: ['예요', '이에요', '가 아니에요', '은'],
        answer: '이에요',
        explanation: 'Danh từ "사람" kết thúc bằng phụ âm, vì vậy ta dùng "이에요".',
        topic: '이에요/예요',
      },
      {
        question: 'Chọn dạng đúng: "이것은 사과___."',
        options: ['예요', '이에요', '입니다', '를'],
        answer: '예요',
        explanation: 'Danh từ "사과" kết thúc bằng nguyên âm, vì vậy ta dùng "예요".',
        topic: '이에요/예요',
      },
      {
        question: 'Dạng phủ định của "학생이에요" (là học sinh) là gì?',
        options: ['학생이 아니에요', '학생은 없어요', '학생이 안 해요', '학생을 못해요'],
        answer: '학생이 아니에요',
        explanation: 'Cấu trúc phủ định "không phải là..." là "Danh từ + 이/가 아니에요".',
        topic: 'Phủ định 이/가 아니다',
      },
      {
        question: 'Câu "이분은 누구___?" (Vị này là ai?) cần điền gì?',
        options: ['예요', '이에요', '를', '가'],
        answer: '예요',
        explanation: 'Từ để hỏi "누구" (ai) kết thúc bằng nguyên âm, do đó dùng "예요".',
        topic: 'Câu hỏi với 이에요/예요',
      },
      {
        question: 'Trong một tình huống trang trọng như phỏng vấn, để nói "Tôi là Kim Minjun", câu nào phù hợp nhất?',
        options: ['저는 김민준예요.', '저는 김민준이에요.', '저는 김민준입니다.', '저는 김민준.'],
        answer: '저는 김민준입니다.',
        explanation: '입니다 là đuôi câu trang trọng, lịch sự nhất của động từ "là", thường được dùng trong các tình huống cần sự tôn trọng cao.',
        topic: ' 입니다 (dạng trang trọng)',
      },
    ],
  },
  {
    id: 'particles',
    name: 'Trợ từ (은/는, 이/가, 을/를, 에/에서, 도, 의, (으)로)',
    description: 'Kiểm tra kiến thức về các trợ từ cơ bản và quan trọng trong tiếng Hàn.',
    level: 'beginner',
    questions: [
      {
        question: 'Điền vào chỗ trống: "저는 학생___."',
        options: ['은', '이', '을', '에'],
        answer: '은',
        explanation: '학생 kết thúc bằng phụ âm nên dùng "은" làm trợ từ chủ đề.',
        topic: 'Trợ từ Chủ đề',
      },
      {
        question: 'Chọn trợ từ đúng: "사과___ 맛있어요."',
        options: ['는', '가', '를', '에서'],
        answer: '가',
        explanation: '사과 kết thúc bằng nguyên âm nên dùng "가" làm trợ từ chủ ngữ để nhấn mạnh "quả táo" là thứ ngon.',
        topic: 'Trợ từ Chủ ngữ',
      },
      {
        question: 'Điền vào chỗ trống: "저는 밥___ 먹어요."',
        options: ['은', '이', '을', '에'],
        answer: '을',
        explanation: '밥 kết thúc bằng phụ âm nên dùng "을" làm trợ từ tân ngữ, chỉ đối tượng của hành động "먹다" (ăn).',
        topic: 'Trợ từ Tân ngữ',
      },
      {
        question: 'Chọn trợ từ đúng: "학교___ 가요."',
        options: ['를', '가', '는', '에'],
        answer: '에',
        explanation: '"에" được dùng để chỉ phương hướng hoặc điểm đến của hành động di chuyển (가요 - đi).',
        topic: 'Trợ từ Địa điểm',
      },
      {
        question: 'Điền vào chỗ trống: "도서관___ 공부해요."',
        options: ['은', '을', '에', '에서'],
        answer: '에서',
        explanation: '"에서" được dùng để chỉ nơi một hành động xảy ra (공부해요 - học).',
        topic: 'Trợ từ Địa điểm',
      },
    ],
  },
  {
    id: 'present_tense',
    name: 'Thì hiện tại (아요/어요/해요)',
    description: 'Luyện tập cách chia động từ và tính từ ở thì hiện tại thân mật, lịch sự.',
    level: 'beginner',
    questions: [
      {
        question: 'Dạng đúng của "가다" (đi) ở thì hiện tại là gì?',
        options: ['가어요', '가요', '가해요', '갔어요'],
        answer: '가요',
        explanation: 'Nguyên âm cuối của "가" là "아", nên ta kết hợp với "아요". Vì "가" không có patchim, "아" bị lược bỏ, còn lại "가요".',
        topic: 'Thì hiện tại',
      },
      {
        question: 'Dạng đúng của "먹다" (ăn) ở thì hiện tại là gì?',
        options: ['먹아요', '먹해요', '먹어요', '먹다요'],
        answer: '먹어요',
        explanation: 'Nguyên âm cuối của "먹" là "어", không phải "아" hay "오", nên ta kết hợp với "어요" thành "먹어요".',
        topic: 'Thì hiện tại',
      },
      {
        question: 'Dạng đúng của "공부하다" (học) ở thì hiện tại là gì?',
        options: ['공부아요', '공부해요', '공부였어요', '공부어요'],
        answer: '공부해요',
        explanation: 'Tất cả các động từ kết thúc bằng "하다" đều được chia thành "해요" ở thì hiện tại.',
        topic: 'Thì hiện tại',
      },
      {
        question: 'Chọn dạng đúng của "보다" (xem) ở thì hiện tại.',
        options: ['봐요', '보어요', '보해요', '봐어요'],
        answer: '봐요',
        explanation: 'Nguyên âm cuối của "보" là "오", nên kết hợp với "아요". "오" và "아" kết hợp thành nguyên âm đôi "와", tạo thành "봐요".',
        topic: 'Thì hiện tại',
      },
      {
        question: 'Dạng đúng của "예쁘다" (đẹp) ở thì hiện tại là gì?',
        options: ['예쁘아요', '예뻐요', '예쁘해요', '예쁘다요'],
        answer: '예뻐요',
        explanation: 'Khi gốc động từ/tính từ kết thúc bằng "으", "으" sẽ bị lược bỏ. Vì nguyên âm trước đó là "예" (không phải "아" hay "오"), ta kết hợp với "어요" thành "예뻐요".',
        topic: 'Thì hiện tại',
      },
    ],
  },
  {
    id: 'past_tense',
    name: 'Thì quá khứ (았/었/했어요)',
    description: 'Luyện tập cách chia động từ và tính từ ở thì quá khứ thân mật, lịch sự.',
    level: 'beginner',
    questions: [
        {
            question: 'Dạng quá khứ của "먹다" (ăn) là gì?',
            options: ['먹았어요', '먹었어요', '먹했어요', '먹다했어요'],
            answer: '먹었어요',
            explanation: 'Nguyên âm của "먹" là "어" (không phải "아/오"), nên ta cộng với "었어요" thành "먹었어요".',
            topic: 'Thì quá khứ',
        },
        {
            question: 'Chọn dạng quá khứ đúng của "오다" (đến).',
            options: ['오았어요', '왔어요', '오했어요', '왔다'],
            answer: '왔어요',
            explanation: 'Nguyên âm "오" kết hợp với "았어요". "오" và "아" được rút gọn thành "와", tạo thành "왔어요".',
            topic: 'Thì quá khứ - Rút gọn nguyên âm',
        },
        {
            question: 'Động từ "운동하다" (tập thể dục) ở thì quá khứ là gì?',
            options: ['운동했었어요', '운동했어요', '운동하다했어요', '운동았어요'],
            answer: '운동했어요',
            explanation: 'Động từ kết thúc bằng "하다" luôn được chia thành "했어요" ở thì quá khứ.',
            topic: 'Thì quá khứ - Động từ 하다',
        },
        {
            question: 'Tính từ "바쁘다" (bận rộn) ở thì quá khứ được chia như thế nào?',
            options: ['바쁘았어요', '바빠요', '바빴어요', '바쁘었어요'],
            answer: '바빴어요',
            explanation: 'Gốc "바쁘" có nguyên âm cuối là "으", nên "으" bị lược bỏ. Nguyên âm trước đó là "아", nên ta cộng với "았어요" thành "바빴어요".',
            topic: 'Thì quá khứ - Lược bỏ 으',
        },
        {
            question: 'Dạng quá khứ của động từ bất quy tắc "듣다" (nghe) là gì?',
            options: ['듣었어요', '들었어요', '듣았어요', '들았어요'],
            answer: '들었어요',
            explanation: '"듣다" là bất quy tắc của "ㄷ". Khi gặp nguyên âm, "ㄷ" sẽ biến thành "ㄹ". Sau đó, vì nguyên âm là "으", ta cộng với "었어요" thành "들었어요".',
            topic: 'Thì quá khứ - Bất quy tắc ㄷ',
        },
    ],
  },
  {
    id: 'future_tense',
    name: 'Thì tương lai ((으)ㄹ 거예요)',
    description: 'Kiểm tra cách diễn tả hành động hoặc trạng thái trong tương lai.',
    level: 'beginner',
    questions: [
        {
            question: 'Dạng tương lai của "가다" (đi) là gì?',
            options: ['갈 거예요', '가을 거예요', '가 거예요', '갔 거예요'],
            answer: '갈 거예요',
            explanation: 'Gốc động từ "가" kết thúc bằng nguyên âm, nên ta cộng với "ㄹ 거예요" thành "갈 거예요".',
            topic: 'Thì tương lai',
        },
        {
            question: 'Chọn dạng tương lai đúng của "읽다" (đọc).',
            options: ['읽ㄹ 거예요', '읽을 거예요', '읽 거예요', '읽했어요'],
            answer: '읽을 거예요',
            explanation: 'Gốc động từ "읽" kết thúc bằng phụ âm, nên ta cộng với "을 거예요" thành "읽을 거예요".',
            topic: 'Thì tương lai',
        },
        {
            question: 'Động từ "놀다" (chơi) ở thì tương lai là gì?',
            options: ['놀을 거예요', '놀 거예요', '놀ㄹ 거예요', '놀게요'],
            answer: '놀 거예요',
            explanation: 'Gốc động từ "놀" kết thúc bằng phụ âm "ㄹ". Trong trường hợp này, ta chỉ cần cộng với "거예요" thành "놀 거예요".',
            topic: 'Thì tương lai - Bất quy tắc ㄹ',
        },
    ],
  },
  {
    id: 'negation',
    name: 'Câu phủ định (안, 못, ~지 않다/못하다)',
    description: 'Kiểm tra cách sử dụng các dạng phủ định trong tiếng Hàn.',
    level: 'beginner',
    questions: [
        {
            question: 'Để diễn tả "Tôi không đi học", câu nào sau đây là đúng?',
            options: ['저는 학교에 못 가요.', '저는 학교에 안 가요.', '저는 학교에 가요 안.', '저는 학교를 안 가요.'],
            answer: '저는 학교에 안 가요.',
            explanation: '"안" được đặt trước động từ để diễn tả sự phủ định đơn thuần (không làm gì đó theo ý muốn).',
            topic: 'Câu phủ định',
        },
        {
            question: 'Chọn câu diễn tả đúng ý "Tôi không thể ăn kim chi (vì cay)."',
            options: ['김치를 안 먹어요.', '김치를 못 먹어요.', '김치를 먹어요 안.', '김치를 먹어요 못.'],
            answer: '김치를 못 먹어요.',
            explanation: '"못" được đặt trước động từ để diễn tả sự không có khả năng làm gì đó (không thể).',
            topic: 'Câu phủ định',
        },
    ]
  },
  {
    id: 'reason_cause',
    name: 'Lý do & Nguyên nhân (~아/어서, ~(으)니까)',
    description: 'Luyện tập cách diễn tả nguyên nhân, lý do cho một hành động hoặc trạng thái.',
    level: 'intermediate',
    questions: [
      {
        question: 'Chọn từ nối đúng: "비가 ___ 집에 있었어요." (Vì trời mưa nên tôi đã ở nhà).',
        options: ['오니까', '와서', '오고', '오지만'],
        answer: '와서',
        explanation: '`~아/어서` được dùng để chỉ lý do, nguyên nhân thông thường. Mệnh đề sau không thể là câu mệnh lệnh hay rủ rê. "오다" -> "와서".',
        topic: 'Nguyên nhân ~아/어서',
      },
      {
        question: 'Điền vào chỗ trống: "날씨가 좋___ 공원에 갑시다." (Thời tiết đẹp nên chúng ta hãy ra công viên đi).',
        options: ['좋아서', '좋으니까', '좋고', '좋지만'],
        answer: '좋으니까',
        explanation: 'Khi mệnh đề sau là một câu rủ rê ("-ㅂ시다"), ta phải dùng `~(으)니까` để chỉ lý do. "좋다" có patchim nên dùng "-으니까".',
        topic: 'Nguyên nhân ~(으)니까',
      },
      {
        question: 'Câu nào sau đây KHÔNG đúng về mặt ngữ pháp?',
        options: ['피곤해서 일찍 잤어요.', '배가 고파서 밥을 먹으세요.', '늦어서 죄송합니다.', '머리가 아파서 약을 먹었어요.'],
        answer: '배가 고파서 밥을 먹으세요.',
        explanation: 'Không thể dùng `~아/어서` với câu mệnh lệnh ("-으세요"). Phải dùng `배가 고프니까 밥을 먹으세요`.',
        topic: 'Phân biệt ~아/어서 và ~(으)니까',
      },
    ]
  },
  {
    id: 'indirect_speech',
    name: 'Tường thuật gián tiếp',
    description: 'Luyện tập cách thuật lại lời nói của người khác (câu trần thuật, câu hỏi, mệnh lệnh, rủ rê).',
    level: 'intermediate',
    questions: [
      {
        question: 'Chuyển câu sau sang dạng gián tiếp: "수진 씨가 말했어요: 저는 학생이에요."',
        options: ['수진 씨가 학생이라고 했어요.', '수진 씨가 학생는다고 했어요.', '수진 씨가 학생이냐고 했어요.', '수진 씨가 학생자고 했어요.'],
        answer: '수진 씨가 학생이라고 했어요.',
        explanation: 'Câu trần thuật với danh từ được thuật lại bằng cấu trúc "Danh từ + -(이)라고 하다".',
        topic: 'Tường thuật gián tiếp - Trần thuật',
      },
      {
        question: 'Chuyển câu sau sang dạng gián tiếp: "민준 씨가 물었어요: 지금 뭐 해요?"',
        options: ['민준 씨가 지금 뭐 하라고 물었어요.', '민준 씨가 지금 뭐 하자고 물었어요.', '민준 씨가 지금 뭐 하냐고 물었어요.', '민준 씨가 지금 뭐 한다고 물었어요.'],
        answer: '민준 씨가 지금 뭐 하냐고 물었어요.',
        explanation: 'Câu hỏi được thuật lại bằng cấu trúc "Động từ + -느냐고 묻다" (dạng nói là "-냐고 묻다").',
        topic: 'Tường thuật gián tiếp - Câu hỏi',
      },
      {
        question: 'Chuyển câu sau sang dạng gián tiếp: "선생님께서 말씀하셨어요: 숙제를 하세요."',
        options: ['선생님께서 숙제를 하라고 하셨어요.', '선생님께서 숙제를 하자고 하셨어요.', '선생님께서 숙제를 하냐고 하셨어요.', '선생님께서 숙제를 한다고 하셨어요.'],
        answer: '선생님께서 숙제를 하라고 하셨어요.',
        explanation: 'Câu mệnh lệnh được thuật lại bằng cấu trúc "Động từ + -(으)라고 하다".',
        topic: 'Tường thuật gián tiếp - Mệnh lệnh',
      },
      {
        question: 'Chuyển câu sau sang dạng gián tiếp: "친구가 말했어요: 같이 영화를 봅시다."',
        options: ['친구가 같이 영화를 보라고 했어요.', '친구가 같이 영화를 보자고 했어요.', '친구가 같이 영화를 보냐고 했어요.', '친구가 같이 영화를 본다고 했어요.'],
        answer: '친구가 같이 영화를 보자고 했어요.',
        explanation: 'Câu rủ rê được thuật lại bằng cấu trúc "Động từ + -자고 하다".',
        topic: 'Tường thuật gián tiếp - Rủ rê',
      },
    ]
  },
   {
    id: 'connectors_adv',
    name: 'Liên từ nối câu (Nâng cao)',
    description: 'Kiểm tra kiến thức về các liên từ thể hiện sự tương phản, bối cảnh, và bổ sung thông tin.',
    level: 'intermediate',
    questions: [
      {
        question: 'Điền vào chỗ trống: "어제 영화를 봤___ 아주 재미있었어요." (Hôm qua tôi đã xem phim, (và) nó rất hay).',
        options: ['는데', '지만', '으니까', '거나'],
        answer: '는데',
        explanation: '`-(으)ㄴ/는데` được dùng để đưa ra bối cảnh cho mệnh đề phía sau.',
        topic: 'Liên từ -(으)ㄴ/는데',
      },
       {
        question: 'Chọn từ nối đúng: "한국어는 어렵___ 재미있어요." (Tiếng Hàn khó nhưng thú vị).',
        options: ['고', '어서', '지만', '으면'],
        answer: '지만',
        explanation: '`~지만` được dùng để nối hai mệnh đề có ý nghĩa tương phản.',
        topic: 'Liên từ ~지만',
      },
    ]
  },
];