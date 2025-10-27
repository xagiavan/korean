import type { GrammarLevel } from '../types';

export const grammarReferenceData: GrammarLevel[] = [
  {
    levelName: 'Sơ cấp',
    levelId: 'beginner',
    categories: [
      {
        categoryName: 'Cấu trúc câu cơ bản',
        points: [
          {
            pattern: 'N + 이에요/예요',
            meaning: 'Là (danh từ)',
            explanation: 'Đuôi câu khẳng định cơ bản nhất trong tiếng Hàn, dùng để giới thiệu hoặc định nghĩa một danh từ. Đây là dạng thân mật, lịch sự (đuôi -yo).',
            conjugation: '- Gắn "이에요" sau danh từ kết thúc bằng phụ âm (patchim). Ví dụ: 사람 -> 사람이에요.\n- Gắn "예요" sau danh từ kết thúc bằng nguyên âm. Ví dụ: 의사 -> 의사예요.',
            examples: [
              { korean: '저는 학생이에요.', romanization: 'Jeoneun haksaeng-ieyo.', vietnamese: 'Tôi là học sinh.' },
              { korean: '이것은 사과예요.', romanization: 'Igeos-eun sagwayeyo.', vietnamese: 'Cái này là quả táo.' },
            ],
            notes: 'Dạng trang trọng, lịch sự hơn là "N + 입니다".',
            culturalNote: 'Trong tiếng Hàn, việc chọn đuôi câu phù hợp (ví dụ: -요 vs. -ㅂ/습니다) rất quan trọng để thể hiện sự tôn trọng. Đuôi -요 (như 이에요/예요) là tiêu chuẩn trong giao tiếp hàng ngày với người không quá thân thiết hoặc lớn tuổi hơn một chút.'
          },
          {
            pattern: 'N + 이/가 아니다',
            meaning: 'Không phải là (danh từ)',
            explanation: 'Dạng phủ định của "이에요/예요", dùng để nói một cái gì đó không phải là một danh từ nào đó.',
            conjugation: '- Gắn "이 아니에요" sau danh từ kết thúc bằng phụ âm.\n- Gắn "가 아니에요" sau danh từ kết thúc bằng nguyên âm.',
            examples: [
              { korean: '저는 의사가 아니에요.', romanization: 'Jeoneun uisaga anieyo.', vietnamese: 'Tôi không phải là bác sĩ.' },
              { korean: '이것은 제 가방이 아니에요.', romanization: 'Igeos-eun je gabang-i anieyo.', vietnamese: 'Cái này không phải là cặp của tôi.' },
            ],
            notes: 'Dạng trang trọng, lịch sự hơn là "N + 이/가 아닙니다".'
          },
          {
            pattern: 'N + 에 있다/없다',
            meaning: 'Có/Ở hoặc Không có/Không ở (tại địa điểm)',
            explanation: 'Diễn tả sự tồn tại hoặc không tồn tại của một người hoặc vật tại một địa điểm cụ thể.',
            conjugation: 'Danh từ (chủ ngữ) + 이/가 + Địa điểm + 에 + 있다/없다.',
            examples: [
              { korean: '고양이가 집 안에 있어요.', romanization: 'goyang-iga jib an-e isseoyo.', vietnamese: 'Con mèo đang ở trong nhà.' },
              { korean: '책상 위에 책이 없어요.', romanization: 'chaegsang wie chaeg-i eopseoyo.', vietnamese: 'Không có quyển sách nào trên bàn.' },
            ],
            culturalNote: 'Khi nói về sự tồn tại của người lớn tuổi hoặc người có địa vị cao, người Hàn dùng động từ kính ngữ "계시다" thay cho "있다". Ví dụ: "선생님께서 교실에 계세요." (Thầy giáo đang ở trong lớp học.)'
          },
          {
            pattern: 'N + 있어요/없어요',
            meaning: 'Có/Không có (sở hữu)',
            explanation: 'Diễn tả sự sở hữu một vật gì đó.',
            conjugation: 'Chủ thể + 은/는 + Danh từ (vật sở hữu) + 이/가 + 있다/없다.',
            examples: [
                { korean: '저는 돈이 있어요.', romanization: 'jeoneun don-i iss-eoyo.', vietnamese: 'Tôi có tiền.' },
                { korean: '저는 시간이 없어요.', romanization: 'jeoneun sigan-i eobs-eoyo.', vietnamese: 'Tôi không có thời gian.' },
            ],
            notes: 'Dạng kính ngữ của 있다/없다 khi nói về người lớn tuổi là 계시다/안 계시다.'
          },
          {
            pattern: 'N + 주세요',
            meaning: 'Hãy cho tôi...',
            explanation: 'Dùng để yêu cầu một thứ gì đó một cách lịch sự.',
            conjugation: 'Danh từ + 주세요.',
            examples: [
                { korean: '물 좀 주세요.', romanization: 'mul jom juseyo.', vietnamese: 'Làm ơn cho tôi một chút nước.' },
                { korean: '김치 더 주세요.', romanization: 'gimchi deo juseyo.', vietnamese: 'Hãy cho tôi thêm kim chi.' },
            ],
          }
        ]
      },
      {
        categoryName: 'Trợ từ cơ bản',
        points: [
          {
            pattern: 'N + 은/는',
            meaning: 'Trợ từ chủ đề',
            explanation: 'Đánh dấu chủ đề chính của câu, thứ mà người nói muốn nói về. Thường được dịch là "thì", "về phần...". Dùng để giới thiệu một chủ đề mới hoặc để so sánh.',
            conjugation: '- Dùng "은" sau danh từ có patchim.\n- Dùng "는" sau danh từ không có patchim.',
            examples: [
              { korean: '저는 베트남 사람이에요.', romanization: 'Jeoneun beteunam saram-ieyo.', vietnamese: 'Tôi thì là người Việt Nam.' },
              { korean: '사과는 맛있어요. 그런데 포도는 맛없어요.', romanization: 'Sagwaneun masisseoyo. Geureonde podoneun maseopseoyo.', vietnamese: 'Táo thì ngon. Nhưng mà nho thì không ngon.' },
            ],
          },
          {
            pattern: 'N + 이/가',
            meaning: 'Trợ từ chủ ngữ',
            explanation: 'Đánh dấu chủ ngữ thực hiện hành động hoặc mang trạng thái được mô tả trong câu. Dùng để nhấn mạnh chủ thể, hoặc khi chủ thể xuất hiện lần đầu.',
            conjugation: '- Dùng "이" sau danh từ có patchim.\n- Dùng "가" sau danh từ không có patchim.',
            examples: [
              { korean: '날씨가 좋아요.', romanization: 'Nalssiga joayo.', vietnamese: 'Thời tiết đẹp.' },
              { korean: '누가 왔어요?', romanization: 'Nuga wasseoyo?', vietnamese: 'Ai đã đến vậy?' },
            ],
          },
          {
            pattern: 'N + 을/를',
            meaning: 'Trợ từ tân ngữ',
            explanation: 'Đánh dấu danh từ là đối tượng bị tác động trực tiếp bởi hành động trong câu.',
            conjugation: '- Dùng "을" sau danh từ có patchim.\n- Dùng "를" sau danh từ không có patchim.',
            examples: [
              { korean: '저는 밥을 먹어요.', romanization: 'Jeoneun bab-eul meogeoyo.', vietnamese: 'Tôi ăn cơm.' },
              { korean: '저는 한국어를 공부해요.', romanization: 'Jeoneun hangugeo-reul gongbuhaeyo.', vietnamese: 'Tôi học tiếng Hàn.' },
            ],
          },
          {
            pattern: 'N + 에',
            meaning: 'Trợ từ địa điểm/thời gian',
            explanation: 'Chỉ vị trí tĩnh (ở), điểm đến (đến), hoặc mốc thời gian (vào lúc).',
            conjugation: 'Gắn sau danh từ chỉ địa điểm hoặc thời gian.',
            examples: [
              { korean: '저는 집에 있어요.', romanization: 'Jeoneun jib-e isseoyo.', vietnamese: 'Tôi đang ở nhà.' },
              { korean: '내일 회사에 가요.', romanization: 'Naeil hoesa-e gayo.', vietnamese: 'Ngày mai tôi đi đến công ty.' },
              { korean: '7시에 만나요.', romanization: 'ilgop-si-e mannayo.', vietnamese: 'Gặp nhau lúc 7 giờ nhé.'}
            ],
          },
          {
            pattern: 'N + 에서',
            meaning: 'Trợ từ địa điểm (hành động)',
            explanation: 'Chỉ nơi một hành động diễn ra (ở tại). Hoặc chỉ điểm xuất phát (từ).',
            conjugation: 'Gắn sau danh từ chỉ địa điểm.',
            examples: [
              { korean: '도서관에서 공부해요.', romanization: 'doseogwan-eseo gongbuhaeyo.', vietnamese: 'Tôi học ở thư viện.' },
              { korean: '어디에서 왔어요?', romanization: 'eodi-eseo wasseoyo?', vietnamese: 'Bạn đến từ đâu?' }
            ],
             notes: 'Phân biệt với "에": "집에 있어요" (ở nhà - trạng thái tĩnh), "집에서 공부해요" (học ở nhà - hành động diễn ra).'
          },
          {
            pattern: 'N + 도',
            meaning: 'Cũng, cả',
            explanation: 'Gắn sau danh từ để thể hiện sự thêm vào, tương đồng. Nó thay thế cho các trợ từ 은/는, 이/가, 을/를.',
            conjugation: 'Gắn trực tiếp sau danh từ.',
            examples: [
              { korean: '저도 학생이에요.', romanization: 'Jeodo haksaeng-ieyo.', vietnamese: 'Tôi cũng là học sinh.' },
              { korean: '저는 사과를 좋아해요. 그리고 포도도 좋아해요.', romanization: 'Jeoneun sagwa-reul johahaeyo. Geurigo pododo johahaeyo.', vietnamese: 'Tôi thích táo. Và tôi cũng thích nho nữa.' },
            ]
          },
           {
            pattern: 'N + 의',
            meaning: 'Của (sở hữu)',
            explanation: 'Thể hiện mối quan hệ sở hữu giữa hai danh từ.',
            conjugation: 'Danh từ 1 + 의 + Danh từ 2.',
            examples: [
                { korean: '이것은 제 친구의 가방이에요.', romanization: 'Igeos-eun je chingu-ui gabang-ieyo.', vietnamese: 'Đây là cái cặp của bạn tôi.' },
            ],
            notes: 'Trong văn nói, "나의" (của tôi) thường rút gọn thành "내", "저의" (của tôi - khiêm tốn) thành "제". "의" thường được phát âm là /에/.'
          },
          {
            pattern: 'N + 하고 / 와/과 / (이)랑',
            meaning: '"Và/Với" cho danh từ',
            explanation: 'Dùng để nối hai danh từ. 하고 và (이)랑 dùng trong văn nói. 와/과 dùng trong văn viết.',
            conjugation: '- 하고: Dùng sau mọi danh từ.\n- 와/과: Dùng "과" sau danh từ có patchim, "와" sau danh từ không có patchim.\n- (이)랑: Dùng "이랑" sau danh từ có patchim, "랑" sau danh từ không có patchim.',
            examples: [
                { korean: '빵하고 우유를 샀어요.', romanization: 'Ppang-hago uyu-reul sasseoyo.', vietnamese: 'Tôi đã mua bánh mì và sữa. (văn nói)' },
                { korean: '저는 친구랑 영화를 봤어요.', romanization: 'jeoneun chingulang yeonghwaleul bwass-eoyo.', vietnamese: 'Tôi đã xem phim với bạn. (văn nói)' },
                { korean: '책과 공책', romanization: 'chaek-gwa gongchaek', vietnamese: 'Sách và vở (văn viết)' },
            ]
          },
          {
            pattern: 'N + (으)로',
            meaning: 'Bằng (phương tiện) / Về phía',
            explanation: 'Chỉ phương tiện, công cụ, nguyên liệu hoặc phương hướng.',
            conjugation: '- Dùng "으로" sau danh từ có patchim (trừ patchim ㄹ).\n- Dùng "로" sau danh từ không có patchim hoặc có patchim ㄹ.',
            examples: [
              { korean: '저는 버스로 학교에 가요.', romanization: 'Jeoneun beoseuro hakgyo-e gayo.', vietnamese: 'Tôi đến trường bằng xe buýt.' },
              { korean: '오른쪽으로 가세요.', romanization: 'Oreunjjogeuro gaseyo.', vietnamese: 'Hãy đi về phía bên phải.' },
            ],
          },
          {
            pattern: 'N + 부터 ~ N + 까지',
            meaning: 'Từ... đến...',
            explanation: 'Diễn tả khoảng thời gian hoặc không gian.',
            conjugation: 'Gắn trực tiếp sau danh từ chỉ điểm bắt đầu và kết thúc.',
            examples: [
              { korean: '아홉 시부터 다섯 시까지 일해요.', romanization: 'Ahop si-buteo daseot si-kkaji ilhaeyo.', vietnamese: 'Tôi làm việc từ 9 giờ đến 5 giờ.' },
               { korean: '서울부터 부산까지', romanization: 'Seoul-buteo Busan-kkaji', vietnamese: 'Từ Seoul đến Busan' },
            ],
          },
          {
            pattern: 'N + 에게 / 한테 / 께',
            meaning: 'Cho, với (người)',
            explanation: 'Chỉ người hoặc động vật là đối tượng tiếp nhận hành động. 에게 và 한테 tương đương (한테 thân mật hơn). 께 là dạng kính ngữ.',
            conjugation: 'Gắn trực tiếp sau danh từ chỉ người/động vật.',
            examples: [
              { korean: '제가 친구한테 선물을 줬어요.', romanization: 'Jega chingu-hante seonmur-eul jwosseoyo.', vietnamese: 'Tôi đã tặng quà cho bạn.' },
              { korean: '할머니께 전화했어요.', romanization: 'Halmeoni-kke jeonhwahaesseoyo.', vietnamese: 'Cháu đã gọi điện cho bà ạ.' },
            ],
            culturalNote: 'Sử dụng "께" thay cho "에게/한테" khi nói chuyện với hoặc về người lớn tuổi hơn, có địa vị cao hơn (ông bà, bố mẹ, thầy cô, sếp) là một phần quan trọng trong văn hóa kính ngữ của Hàn Quốc.'
          },
          {
            pattern: 'N + 만',
            meaning: 'Chỉ',
            explanation: 'Gắn sau danh từ để thể hiện sự độc nhất hoặc giới hạn.',
            conjugation: 'Gắn trực tiếp sau danh từ.',
            examples: [
              { korean: '저는 커피만 마셔요.', romanization: 'Jeoneun keopi-man masyeoyo.', vietnamese: 'Tôi chỉ uống cà phê thôi.' },
            ],
          },
          {
            pattern: 'N + (이)나',
            meaning: 'Hoặc là / Những / Tận',
            explanation: '1. Diễn tả sự lựa chọn (hoặc là). 2. Diễn tả số lượng nhiều hơn mong đợi (những, tận).',
            conjugation: 'Gắn "이나" sau danh từ có patchim, "나" sau danh từ không có patchim.',
            examples: [
                { korean: '주말에 영화나 책을 읽을 거예요.', romanization: 'jumal-e yeonghwana chaeg-eul ilg-eul geoyeyo.', vietnamese: 'Cuối tuần tôi sẽ xem phim hoặc đọc sách.' },
                { korean: '어제 케이크를 다섯 조각이나 먹었어요.', romanization: 'eoje keikeuleul daseos jogag-ina meog-eoss-eoyo.', vietnamese: 'Hôm qua tôi đã ăn tận 5 miếng bánh.' },
            ]
          }
        ]
      },
      {
        categoryName: 'Các thì (Tenses)',
        points: [
          {
            pattern: 'V/A + 아요/어요/해요',
            meaning: 'Thì hiện tại (thân mật, lịch sự)',
            explanation: 'Cách chia động từ/tính từ phổ biến nhất trong giao tiếp hàng ngày.',
            conjugation: '- Gốc V/A có nguyên âm "아/오" -> + "아요".\n- Các trường hợp còn lại -> + "어요".\n- Động từ "하다" -> "해요".',
            examples: [
              { korean: '저는 매일 운동해요.', romanization: 'Jeoneun maeil undonghaeyo.', vietnamese: 'Tôi tập thể dục mỗi ngày.' },
              { korean: '이 케이크는 아주 맛있어요.', romanization: 'I keikeu-neun aju masisseoyo.', vietnamese: 'Cái bánh này rất ngon.' },
            ],
          },
           {
            pattern: 'V/A + 았/었어요',
            meaning: 'Thì quá khứ',
            explanation: 'Diễn tả hành động hoặc trạng thái đã xảy ra và kết thúc trong quá khứ.',
            conjugation: '- Gốc V/A có nguyên âm "아/오" -> + "았어요".\n- Các trường hợp còn lại -> + "었어요".\n- Động từ "하다" -> "했어요".',
            examples: [
              { korean: '어제 영화를 봤어요.', romanization: 'Eoje yeonghwareul bwasseoyo.', vietnamese: 'Hôm qua tôi đã xem phim.' },
              { korean: '학생이었어요.', romanization: 'Haksaeng-ieosseoyo.', vietnamese: 'Tôi đã từng là học sinh.' },
            ],
          },
          {
            pattern: 'V/A + (으)ㄹ 거예요',
            meaning: 'Thì tương lai (sẽ...)',
            explanation: 'Diễn tả một kế hoạch, dự định trong tương lai, hoặc một phỏng đoán.',
            conjugation: '- Gốc V/A có patchim -> + "을 거예요".\n- Gốc V/A không có patchim hoặc có patchim "ㄹ" -> + "ㄹ 거예요".',
            examples: [
              { korean: '주말에 친구를 만날 거예요.', romanization: 'Jumal-e chingu-reul mannal geoyeyo.', vietnamese: 'Cuối tuần tôi sẽ gặp bạn.' },
              { korean: '내일은 비가 올 거예요.', romanization: 'Naeil-eun biga ol geoyeyo.', vietnamese: 'Ngày mai chắc trời sẽ mưa.' },
            ],
          },
          {
            pattern: 'V + -고 있다',
            meaning: 'Thì hiện tại tiếp diễn (đang...)',
            explanation: 'Diễn tả một hành động đang diễn ra tại thời điểm nói.',
            conjugation: 'Gốc V + `~고 있다`.',
            examples: [
              { korean: '저는 지금 밥을 먹고 있어요.', romanization: 'jeoneun jigeum bab-eul meoggo isseoyo.', vietnamese: 'Bây giờ tôi đang ăn cơm.'},
            ],
            notes: 'Dạng kính ngữ là `~고 계시다`.'
          },
          {
            pattern: 'V + -(으)ㄹ게요',
            meaning: 'Sẽ (lời hứa/ý chí)',
            explanation: 'Diễn tả ý định hoặc lời hứa của người nói, thường là phản ứng lại lời nói của người khác. Chỉ dùng với ngôi thứ nhất.',
            conjugation: '- Gốc V có patchim -> `~을게요`.\n- Gốc V không có patchim hoặc có patchim ㄹ -> `~ㄹ게요`.',
            examples: [
              { korean: 'A: 너무 추워요. B: 그럼 제가 문을 닫을게요.', romanization: 'A: neomu chuwoyo. B: geuleom jega mun-eul dad-eulgeyo.', vietnamese: 'A: Lạnh quá. B: Vậy thì để tôi đóng cửa cho.' },
            ],
          }
        ]
      },
      {
        categoryName: 'Câu phủ định',
        points: [
          {
            pattern: '안 + V/A',
            meaning: 'Không... (phủ định ý muốn)',
            explanation: 'Dạng phủ định ngắn, diễn tả hành động/trạng thái không xảy ra theo ý muốn của chủ thể.',
            conjugation: '안 + V/A. Với động từ "하다", đặt "안" trước "하다": 운동 안 해요.',
            examples: [
              { korean: '오늘은 학교에 안 가요.', romanization: 'Oneul-eun hakgyo-e an gayo.', vietnamese: 'Hôm nay tôi không đi học.' },
            ],
          },
          {
            pattern: '못 + V',
            meaning: 'Không thể... (phủ định năng lực)',
            explanation: 'Dạng phủ định ngắn, diễn tả sự không có khả năng làm gì đó. Chỉ dùng với động từ.',
            conjugation: '못 + V. Với động từ "하다", đặt "못" trước "하다": 수영 못 해요.',
            examples: [
              { korean: '저는 수영을 못 해요.', romanization: 'Jeoneun suyeong-eul mot haeyo.', vietnamese: 'Tôi không biết bơi.' },
            ],
          },
          {
            pattern: 'V/A + -지 않다',
            meaning: 'Không... (dạng dài)',
            explanation: 'Dạng phủ định dài của "안", mang sắc thái trang trọng hơn.',
            conjugation: 'Gốc V/A + `~지 않다`.',
            examples: [
              { korean: '저는 술을 마시지 않아요.', romanization: 'Jeoneun sul-eul masiji anayo.', vietnamese: 'Tôi không uống rượu.' },
            ],
          },
          {
            pattern: 'V + -지 못하다',
            meaning: 'Không thể... (dạng dài)',
            explanation: 'Dạng phủ định dài của "못", mang sắc thái trang trọng hơn.',
            conjugation: 'Gốc V + `~지 못하다`.',
            examples: [
              { korean: '한국어를 아직 잘하지 못해요.', romanization: 'Hangugeo-reul ajik jalhaji mothaeyo.', vietnamese: 'Tôi vẫn chưa thể giỏi tiếng Hàn.' },
            ],
          },
        ]
      },
      {
        categoryName: 'Liên từ & Mệnh đề phụ',
        points: [
          {
            pattern: 'V/A + -고',
            meaning: 'Và, rồi, sau đó',
            explanation: 'Dùng để nối hai hành động xảy ra theo trình tự thời gian, hoặc liệt kê hai trạng thái.',
            conjugation: 'Gắn trực tiếp vào gốc động từ/tính từ.',
            examples: [
              { korean: '저는 밥을 먹고 학교에 가요.', romanization: 'Jeoneun bab-eul meokgo hakgyo-e gayo.', vietnamese: 'Tôi ăn cơm rồi đi học.' },
              { korean: '그 사람은 키가 크고 멋있어요.', romanization: 'Geu saram-eun kiga keugo meosisseoyo.', vietnamese: 'Người đó vừa cao vừa ngầu.' },
            ]
          },
          {
            pattern: 'V/A + -지만',
            meaning: 'Nhưng',
            explanation: 'Dùng để nối hai mệnh đề có ý nghĩa tương phản, đối lập nhau.',
            conjugation: 'Gắn trực tiếp vào gốc động từ/tính từ.',
            examples: [
              { korean: '한국어는 어렵지만 재미있어요.', romanization: 'Hangugeo-neun eoryeopjiman jaemiisseoyo.', vietnamese: 'Tiếng Hàn khó nhưng thú vị.' },
            ]
          },
           {
            pattern: 'V/A + -아/어서',
            meaning: 'Vì... nên... / ...rồi...',
            explanation: '1. Diễn tả nguyên nhân - kết quả. 2. Diễn tả hai hành động xảy ra theo trình tự và có liên quan mật thiết.',
            conjugation: 'Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `서`.',
            examples: [
              { korean: '배가 아파서 병원에 갔어요.', romanization: 'Baega apaseo byeong-won-e gasseoyo.', vietnamese: 'Vì đau bụng nên tôi đã đi bệnh viện.' },
              { korean: '친구를 만나서 영화를 봤어요.', romanization: 'Chingu-reul mannaseo yeonghwa-reul bwasseoyo.', vietnamese: 'Tôi gặp bạn rồi (cùng nhau) xem phim.' },
            ],
            notes: 'Khi diễn tả nguyên nhân, mệnh đề sau KHÔNG được là câu mệnh lệnh hoặc rủ rê.'
          },
           {
            pattern: 'V/A + -(으)면',
            meaning: 'Nếu... thì...',
            explanation: 'Dùng để diễn tả một điều kiện hoặc giả định.',
            conjugation: '- Gốc có patchim -> + "으면".\n- Gốc không có patchim hoặc có patchim "ㄹ" -> + "면".',
            examples: [
              { korean: '시간이 있으면 같이 영화 볼까요?', romanization: 'Sigan-i isseumyeon gachi yeonghwa bolkkayo?', vietnamese: 'Nếu có thời gian, chúng ta cùng xem phim nhé?' },
            ]
          },
          {
            pattern: 'V/A + -(으)니까',
            meaning: 'Vì... nên...',
            explanation: 'Dùng để chỉ nguyên nhân, lý do. Thường dùng khi người nghe đã biết về lý do đó, hoặc khi mệnh đề sau là câu mệnh lệnh/rủ rê.',
            conjugation: '- Gốc có patchim -> + "으니까".\n- Gốc không có patchim hoặc có patchim "ㄹ" -> + "니까".',
            examples: [
              { korean: '날씨가 좋으니까 공원에 갑시다.', romanization: 'Nalssiga joeunikka gong-won-e gapsida.', vietnamese: 'Vì thời tiết đẹp nên chúng ta hãy ra công viên đi.' },
            ],
          },
          {
            pattern: 'V + -거나',
            meaning: 'Hoặc là',
            explanation: 'Dùng để nối hai hành động hoặc trạng thái mang tính lựa chọn.',
            conjugation: 'Gốc V + `거나`.',
            examples: [
                { korean: '주말에 영화를 보거나 책을 읽어요.', romanization: 'Jumal-e yeonghwa-reul bogeona chaeg-eul ilgeoyo.', vietnamese: 'Cuối tuần tôi xem phim hoặc đọc sách.' },
            ],
          },
          {
            pattern: 'V + -(으)러 가다/오다',
            meaning: 'Đi đâu để làm gì',
            explanation: 'Diễn tả mục đích của hành động di chuyển.',
            conjugation: '- Gốc V có patchim -> `~으러`.\n- Gốc V không có patchim hoặc có patchim ㄹ -> `~러`.',
            examples: [
              { korean: '한국어를 배우러 한국에 왔어요.', romanization: 'hangugeo-reul baeuleo hangug-e wasseoyo.', vietnamese: 'Tôi đến Hàn Quốc để học tiếng Hàn.' },
            ],
          },
        ]
      },
      {
        categoryName: 'Mong muốn & Khả năng',
        points: [
          {
            pattern: 'V + -고 싶다',
            meaning: 'Muốn (làm gì đó)',
            explanation: 'Gắn vào sau gốc động từ để diễn tả mong muốn của người nói (ngôi thứ nhất và thứ hai).',
            conjugation: 'Gắn trực tiếp vào gốc động từ.',
            examples: [
              { korean: '저는 여행을 가고 싶어요.', romanization: 'Jeoneun yeohaeng-eul gago sipeoyo.', vietnamese: 'Tôi muốn đi du lịch.' },
            ],
          },
          {
            pattern: 'V + -고 싶어하다',
            meaning: 'Muốn (dùng cho ngôi thứ ba)',
            explanation: 'Dùng để nói về mong muốn của người khác (ngôi thứ ba) dựa trên quan sát.',
            conjugation: 'Gắn trực tiếp vào gốc động từ.',
            examples: [
              { korean: '제 동생은 강아지를 키우고 싶어해요.', romanization: 'Je dongsaeng-eun gang-ajireul kiugo sipeohaeyo.', vietnamese: 'Em tôi muốn nuôi một chú chó.' },
            ],
          },
          {
            pattern: 'V + -(으)ㄹ 수 있다/없다',
            meaning: 'Có thể / Không thể',
            explanation: 'Diễn tả khả năng hoặc bất khả năng thực hiện một hành động.',
            conjugation: '- Gốc có patchim -> + "을 수 있다/없다".\n- Gốc không có patchim hoặc có patchim "ㄹ" -> + "ㄹ 수 있다/없다".',
            examples: [
              { korean: '저는 한국어를 할 수 있어요.', romanization: 'Jeoneun hangugeo-reul hal su isseoyo.', vietnamese: 'Tôi có thể nói tiếng Hàn.' },
              { korean: '지금은 바빠서 갈 수 없어요.', romanization: 'Jigeum-eun bappaseo gal su eopseoyo.', vietnamese: 'Bây giờ bận quá nên không thể đi được.' },
            ],
          },
        ]
      },
      {
        categoryName: 'Mệnh lệnh, Rủ rê & Cho phép',
        points: [
          {
            pattern: 'V/A + -(으)세요',
            meaning: 'Hãy... (mệnh lệnh lịch sự)',
            explanation: 'Đuôi câu yêu cầu, ra lệnh một cách lịch sự. Cũng là dạng kính ngữ của thì hiện tại.',
            conjugation: '- Gốc có patchim -> `~으세요`.\n- Gốc không có patchim hoặc có patchim ㄹ -> `~세요`.',
            examples: [
              { korean: '여기에 앉으세요.', romanization: 'Yeogi-e anjeuseyo.', vietnamese: 'Xin mời ngồi ở đây.' },
            ],
            culturalNote: 'Đây là một trong những đuôi câu kính ngữ cơ bản và quan trọng nhất. Sử dụng đuôi câu này khi nói chuyện với người lớn tuổi, người có địa vị cao hơn, hoặc khách hàng để thể hiện sự tôn trọng.'
          },
          {
            pattern: 'V + -지 마세요',
            meaning: 'Đừng... (mệnh lệnh phủ định)',
            explanation: 'Yêu cầu ai đó không làm một việc gì.',
            conjugation: 'Gốc V + `지 마세요`.',
            examples: [
              { korean: '걱정하지 마세요.', romanization: 'Geokjeonghaji maseyo.', vietnamese: 'Đừng lo lắng.' },
            ],
          },
          {
            pattern: 'V + -(으)ㅂ시다',
            meaning: 'Chúng ta hãy...',
            explanation: 'Đuôi câu rủ rê, đề nghị cùng làm gì đó (dạng trang trọng).',
            conjugation: '- Gốc có patchim -> `~읍시다`.\n- Gốc không có patchim hoặc có patchim ㄹ -> `~ㅂ시다`.',
            examples: [
              { korean: '같이 점심을 먹읍시다.', romanization: 'Gachi jeomsim-eul meogeupsida.', vietnamese: 'Chúng ta hãy cùng ăn trưa.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ까요?',
            meaning: '...nhé? / ...nhỉ?',
            explanation: '1. Rủ rê, hỏi ý kiến người nghe. 2. Phỏng đoán, tự hỏi bản thân.',
            conjugation: '- Gốc có patchim -> `~을까요`.\n- Gốc không có patchim hoặc có patchim ㄹ -> `~ㄹ까요`.',
            examples: [
              { korean: '내일 우리 영화를 볼까요?', romanization: 'Naeil uri yeonghwa-reul bolkkayo?', vietnamese: 'Ngày mai chúng ta xem phim nhé?' },
              { korean: '지금쯤 민준 씨가 도착했을까요?', romanization: 'Jigeumjjeum Minjun-ssiga dochakhaesseulkkayo?', vietnamese: 'Liệu giờ này anh Minjun đã đến nơi chưa nhỉ?' },
            ],
          },
          {
            pattern: 'V/A + -아/어도 되다',
            meaning: '... cũng được / được phép...',
            explanation: 'Dùng để cho phép hoặc hỏi xin phép làm một việc gì đó.',
            conjugation: 'Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `도 되다`.',
            examples: [
              { korean: '여기에 앉아도 돼요?', romanization: 'yeogie anj-ado dwaeyo?', vietnamese: 'Tôi ngồi ở đây có được không?'},
            ],
          },
        ]
      },
      {
        categoryName: 'Định ngữ (Adnominals)',
        points: [
          {
            pattern: 'A + -(으)ㄴ N',
            meaning: 'Danh từ mà (tính từ - hiện tại)',
            explanation: 'Dùng tính từ để bổ nghĩa cho danh từ ở thì hiện tại.',
            conjugation: '- Gốc A có patchim -> `~은`.\n- Gốc A không có patchim -> `~ㄴ`.',
            examples: [
              { korean: '예쁜 여자를 봤어요.', romanization: 'yeppeun yeojaleul bwass-eoyo.', vietnamese: 'Tôi đã thấy một cô gái xinh đẹp.' },
            ],
          },
          {
            pattern: 'V + -는 N',
            meaning: 'Danh từ mà (đang) ... (hiện tại)',
            explanation: 'Dùng động từ để bổ nghĩa cho danh từ ở thì hiện tại.',
            conjugation: 'Gốc V + `~는`.',
            examples: [
              { korean: '저기 가는 사람이 제 친구예요.', romanization: 'jeogi ganeun salam-i je chingu-yeyo.', vietnamese: 'Người đang đi ở đằng kia là bạn tôi.' },
            ],
          },
          {
            pattern: 'V + -(으)ㄴ N',
            meaning: 'Danh từ mà (đã)... (quá khứ)',
            explanation: 'Dùng động từ để bổ nghĩa cho danh từ ở thì quá khứ.',
            conjugation: '- Gốc V có patchim -> `~은`.\n- Gốc V không có patchim -> `~ㄴ`.',
            examples: [
              { korean: '어제 본 영화가 재미있었어요.', romanization: 'eoje bon yeonghwaga jaemiiss-eoss-eoyo.', vietnamese: 'Bộ phim (mà tôi đã) xem hôm qua rất hay.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ N',
            meaning: 'Danh từ mà (sẽ)... (tương lai)',
            explanation: 'Dùng động từ/tính từ để bổ nghĩa cho danh từ ở thì tương lai hoặc diễn tả sự phỏng đoán.',
            conjugation: '- Gốc V/A có patchim -> `~을`.\n- Gốc V/A không có patchim -> `~ㄹ`.',
            examples: [
              { korean: '내일 만날 사람에게 줄 선물이에요.', romanization: 'naeil mannal salam-ege jul seonmul-ieyo.', vietnamese: 'Đây là món quà sẽ tặng cho người mà tôi sẽ gặp vào ngày mai.' },
            ],
          },
        ]
      },
      {
        categoryName: 'Các cấu trúc khác',
        points: [
          {
            pattern: 'V + -아/어 주다',
            meaning: 'Làm gì đó cho ai',
            explanation: 'Diễn tả một hành động được làm vì lợi ích của người khác. Khi kết hợp với `-(으)세요` thành `~아/어 주세요` (làm ơn hãy...).',
            conjugation: 'Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `주다`.',
            examples: [
              { korean: '문을 좀 열어 주세요.', romanization: 'mun-eul jom yeol-eo juseyo.', vietnamese: 'Làm ơn mở cửa giúp tôi.'},
            ],
            notes: 'Dạng kính ngữ là `~아/어 드리다`.'
          },
          {
            pattern: 'V/A + -아/어 보다',
            meaning: 'Thử làm gì đó',
            explanation: 'Diễn tả việc thử làm một hành động nào đó để có kinh nghiệm.',
            conjugation: 'Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `보다`.',
            examples: [
              { korean: '이 옷을 입어 봐도 돼요?', romanization: 'i os-eul ib-eo bwado dwaeyo?', vietnamese: 'Tôi mặc thử cái áo này được không?'},
            ],
          },
          {
            pattern: 'V/A + -게',
            meaning: 'Một cách... (Trạng từ)',
            explanation: 'Biến tính từ thành trạng từ để bổ nghĩa cho động từ.',
            conjugation: 'Gốc A + `~게`.',
            examples: [
              { korean: '음식을 맛있게 만들었어요.', romanization: 'eumsig-eul mas-issge mandeul-eoss-eoyo.', vietnamese: 'Tôi đã làm món ăn một cách ngon miệng.'},
            ],
          },
          {
            pattern: 'N + 때문에',
            meaning: 'Vì (danh từ)',
            explanation: 'Chỉ danh từ là nguyên nhân của một sự việc. Thường mang sắc thái trung tính hoặc tiêu cực.',
            conjugation: 'N + `때문에`.',
            examples: [
              { korean: '시험 때문에 스트레스를 많이 받아요.', romanization: 'siheom ttaemun-e seuteuleseuleul manh-i bad-ayo.', vietnamese: 'Vì kỳ thi nên tôi bị căng thẳng nhiều.'},
            ],
          },
          {
            pattern: 'N + 보다',
            meaning: 'Hơn (so sánh)',
            explanation: 'Dùng để so sánh hơn.',
            conjugation: 'N1 + 이/가 + N2 + 보다 + A.',
            examples: [
              { korean: '사과가 포도보다 더 비싸요.', romanization: 'sagwaga podoboda deo bissayo.', vietnamese: 'Táo đắt hơn nho.'},
            ],
          },
          {
            pattern: '가장 / 제일',
            meaning: 'Nhất (so sánh)',
            explanation: 'Dùng để so sánh nhất.',
            conjugation: '가장/제일 + A/Adverb.',
            examples: [
              { korean: '이 반에서 누가 제일 똑똑해요?', romanization: 'i ban-eseo nuga jeil ttogttoghaeyo?', vietnamese: 'Trong lớp này ai là người thông minh nhất?'},
            ],
          },
          {
            pattern: 'V/A + -아/어야 하다/되다',
            meaning: 'Phải...',
            explanation: 'Diễn tả nghĩa vụ, sự cần thiết.',
            conjugation: 'Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `야 하다/되다`.',
            examples: [
              { korean: '내일까지 이 숙제를 해야 해요.', romanization: 'naeilkkaji i sugjeleul haeya haeyo.', vietnamese: 'Tôi phải làm xong bài tập này trước ngày mai.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄴ/는/(으)ㄹ 것 같다',
            meaning: 'Có vẻ như / Hình như là...',
            explanation: 'Cấu trúc phỏng đoán phổ biến nhất, dùng để diễn tả suy đoán của người nói về hiện tại, quá khứ hoặc tương lai.',
            conjugation: '- Hiện tại (Động từ): `~는 것 같다`\n- Hiện tại (Tính từ): `~(으)ㄴ 것 같다`\n- Quá khứ: `~(으)ㄴ 것 같다` hoặc `~았/었을 것 같다`\n- Tương lai: `~(으)ㄹ 것 같다`',
            examples: [
              { korean: '밖에 비가 오는 것 같아요.', romanization: 'bakk-e biga oneun geot gat-ayo.', vietnamese: 'Có vẻ như ngoài trời đang mưa. (Hiện tại)' },
              { korean: '이 영화는 재미있을 것 같아요.', romanization: 'i yeonghwa-neun jaemiiss-eul geot gat-ayo.', vietnamese: 'Bộ phim này có vẻ sẽ thú vị. (Tương lai)' },
            ],
          },
           {
            pattern: 'Số Thuần Hàn & Số Hán Hàn',
            meaning: 'Hệ thống số đếm',
            explanation: 'Tiếng Hàn có hai hệ thống số: Thuần Hàn (하나, 둘...) dùng để đếm tuổi, giờ, số lượng; và Hán-Hàn (일, 이...) dùng cho ngày tháng, tiền bạc, phút, số điện thoại.',
            conjugation: 'Thuần Hàn: 하나, 둘, 셋, 넷...\nHán-Hàn: 일, 이, 삼, 사...',
            examples: [
              { korean: '사과 세 개 주세요.', romanization: 'sagwa se gae juseyo.', vietnamese: 'Cho tôi 3 quả táo. (Thuần Hàn)' },
              { korean: '지금은 네 시 삼십 분이에요.', romanization: 'jigeum-eun ne si samsib bun-ieyo.', vietnamese: 'Bây giờ là 4 giờ 30 phút. (Giờ - Thuần Hàn, Phút - Hán-Hàn)' },
              { korean: '이거 오천 원이에요.', romanization: 'igeo ocheon won-ieyo.', vietnamese: 'Cái này giá 5000 won. (Hán-Hàn)' },
            ],
          },
          {
            pattern: 'V + -는 중이다',
            meaning: 'Đang trong quá trình...',
            explanation: 'Tương tự `~고 있다`, diễn tả một hành động đang diễn ra. Thường mang sắc thái trang trọng hơn.',
            conjugation: 'Gốc V + `~는 중이다`. Hoặc Danh từ + `~중이다`.',
            examples: [
              { korean: '지금 회의 중입니다.', romanization: 'jigeum hoeui jung-ibnida.', vietnamese: 'Bây giờ đang trong cuộc họp ạ.' },
              { korean: '새로운 프로젝트를 진행하는 중이에요.', romanization: 'saeloun peulojegteuleul jinhaenghaneun jung-ieyo.', vietnamese: 'Tôi đang trong quá trình tiến hành một dự án mới.' },
            ],
          }
        ]
      },
    ]
  },
  {
    levelName: 'Trung cấp',
    levelId: 'intermediate',
    categories: [
       {
        categoryName: 'Lý do & Nguyên nhân (Nâng cao)',
        points: [
          {
            pattern: 'V + ~느라고',
            meaning: 'Vì mải... nên...',
            explanation: 'Diễn tả một lý do (thường là một hành động kéo dài) dẫn đến một kết quả tiêu cực ở mệnh đề sau.',
            conjugation: 'Chỉ dùng với động từ. Gốc V + 느라고.',
            examples: [
              { korean: '어젯밤에 축구를 보느라고 숙제를 못 했어요.', romanization: 'Eojetbam-e chukgu-reul boneurago sukje-reul mot haesseoyo.', vietnamese: 'Đêm qua vì mải xem bóng đá nên tôi đã không thể làm bài tập.' },
            ],
            notes: 'Chủ ngữ của hai mệnh đề phải giống nhau. Mệnh đề sau luôn là kết quả tiêu cực.'
          },
          {
            pattern: 'V + ~는 바람에',
            meaning: 'Vì... (bất ngờ) nên...',
            explanation: 'Diễn tả một nguyên nhân bất ngờ, không lường trước dẫn đến một kết quả tiêu cực.',
            conjugation: 'Chỉ dùng với động từ. Gốc V + 는 바람에.',
            examples: [
              { korean: '늦잠을 자는 바람에 시험을 못 봤어요.', romanization: 'Neutjam-eul janeun baram-e siheom-eul mot bwasseoyo.', vietnamese: 'Vì (lỡ) ngủ quên nên tôi đã không thể dự thi.' },
            ],
             notes: 'Nhấn mạnh tính bất ngờ của nguyên nhân và kết quả luôn là tiêu cực.'
          },
          {
            pattern: 'N + 덕분에 / V-(으)ㄴ 덕분에',
            meaning: 'Nhờ vào...',
            explanation: 'Diễn tả một lý do hoặc nguyên nhân dẫn đến một kết quả TỐT.',
            conjugation: '- Danh từ: N + 덕분에\n- Động từ: V + -(으)ㄴ 덕분에',
            examples: [
              { korean: '선생님 덕분에 한국어 실력이 많이 늘었어요.', romanization: 'Seonsaengnim deokbun-e hangugeo sillyeog-i manh-i neul-eosseoyo.', vietnamese: 'Nhờ có cô giáo mà trình độ tiếng Hàn của em đã tiến bộ nhiều.' },
              { korean: '네가 도와준 덕분에 일을 빨리 끝냈어.', romanization: 'Nega dowajun deokbun-e il-eul ppalli kkeutnaess-eo.', vietnamese: 'Nhờ có bạn giúp đỡ mà tớ đã làm xong việc nhanh chóng.' },
            ],
            notes: 'Trái ngược với `~탓에` (tại vì) dùng cho kết quả xấu.'
          },
          {
            pattern: 'V/A + -(으)ㄴ/는 탓에',
            meaning: 'Tại vì / Do... (kết quả xấu)',
            explanation: 'Dùng để đổ lỗi cho một nguyên nhân đã gây ra một kết quả tiêu cực.',
            conjugation: '- Động từ quá khứ / Tính từ: `-(으)ㄴ 탓에`.\n- Động từ hiện tại: `-는 탓에`.',
            examples: [
              { korean: '밤새 게임을 한 탓에 아침에 늦게 일어났어요.', romanization: 'Bamsae geim-eul han tat-e achim-e neutge il-eonasseoyo.', vietnamese: 'Tại vì chơi game suốt đêm nên sáng tôi đã dậy muộn.' },
            ],
          },
           {
            pattern: 'V/A + -(으)ㄹ까 봐(서)',
            meaning: 'Vì sợ rằng.../Vì lo là...',
            explanation: 'Diễn tả hành động được thực hiện để phòng ngừa một kết quả tiêu cực có thể xảy ra.',
            conjugation: '- Gốc V/A có patchim -> `~을까 봐서`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~ㄹ까 봐서`.',
            examples: [
                { korean: '시험에 떨어질까 봐 열심히 공부했어요.', romanization: 'siheom-e tteol-eojilkka bwa yeolsimhi gongbuhaess-eoyo.', vietnamese: 'Vì sợ trượt kỳ thi nên tôi đã học chăm chỉ.' },
            ],
          },
          {
            pattern: 'V + ~기 위해서',
            meaning: 'Để/Vì (mục đích)',
            explanation: 'Diễn tả mục đích "để làm gì" hoặc "vì lợi ích của ai/cái gì". Trang trọng hơn `-(으)러`.',
            conjugation: 'Gốc V + `~기 위해서`. Hoặc Danh từ + `~을/를 위해서`.',
            examples: [
              { korean: '저는 한국 회사에서 일하기 위해서 한국어를 배워요.', romanization: 'Jeoneun hanguk hoesa-eseo ilhagi wihaeseo hangugeo-reul baewoyo.', vietnamese: 'Tôi học tiếng Hàn để làm việc ở công ty Hàn Quốc.' },
              { korean: '건강을 위해서 매일 운동해야 해요.', romanization: 'geongang-eul wihaeseo maeil undonghaeya haeyo.', vietnamese: 'Phải tập thể dục mỗi ngày vì sức khoẻ.' },
            ],
          },
          {
            pattern: 'V/A + ~거든요',
            meaning: 'Vì... / ...đấy mà (giải thích lý do)',
            explanation: 'Dùng ở cuối câu để giải thích một lý do hoặc cung cấp thông tin nền cho điều đã nói trước đó, hoặc để trả lời câu hỏi "Tại sao?". Người nói cho rằng người nghe chưa biết thông tin này.',
            conjugation: 'Gắn trực tiếp vào gốc động từ/tính từ. Với thì quá khứ, dùng -았/었거든요.',
            examples: [
              { korean: 'A: 왜 이렇게 피곤해 보여요? B: 어젯밤에 잠을 못 잤거든요.', romanization: 'A: wae ileohge pigonhae boyeoyo? B: eojesbam-e jam-eul mos jassgeodeun-yo.', vietnamese: 'A: Sao bạn trông mệt mỏi vậy? B: Tại đêm qua tôi không ngủ được đấy.' },
              { korean: '이 식당은 인기가 많아요. 아주 맛있거든요.', romanization: 'i sigdang-eun ingiga manh-ayo. aju mas-issgeodeun-yo.', vietnamese: 'Nhà hàng này nổi tiếng lắm. (Vì) nó rất ngon đấy.' },
            ],
            notes: 'Thường không dùng với người lớn tuổi hoặc trong các tình huống trang trọng.'
          },
          {
            pattern: 'V/A + ~아/어 가지고',
            meaning: 'Vì... nên... / ...rồi...',
            explanation: 'Dùng trong văn nói, có hai nghĩa tương tự `~아/어서`. 1. Chỉ nguyên nhân-kết quả. 2. Chỉ trình tự hành động.',
            conjugation: 'Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `가지고`.',
            examples: [
              { korean: '어제는 피곤해 가지고 일찍 잤어요.', romanization: 'eoje-neun pigonhae gajigo iljjig jass-eoyo.', vietnamese: 'Hôm qua vì mệt nên tôi đã đi ngủ sớm.' },
              { korean: '돈을 찾아 가지고 시장에 갔어요.', romanization: 'don-eul chaj-a gajigo sijang-e gass-eoyo.', vietnamese: 'Tôi rút tiền rồi đi chợ.' },
            ],
            notes: 'Mệnh đề sau không thể là câu mệnh lệnh/rủ rê, giống `~아/어서`.'
          },
          {
            pattern: 'V + ~는 통에',
            meaning: 'Do / Vì (kết quả xấu)',
            explanation: 'Diễn tả một nguyên nhân (thường là một tình huống ồn ào, hỗn loạn) gây ra một kết quả tiêu cực. Tương tự `~는 바람에`.',
            conjugation: 'Gốc V + `~는 통에`.',
            examples: [
              { korean: '아이들이 떠드는 통에 정신이 하나도 없었다.', romanization: 'aideul-i tteodeuneun tong-e jeongsin-i hanado eobs-eossda.', vietnamese: 'Do bọn trẻ làm ồn nên tôi chẳng tập trung được gì cả.' },
            ],
          },
           {
            pattern: 'V + -(으)려고 하다',
            meaning: 'Định / Có ý định làm gì',
            explanation: 'Dùng để nói về một kế hoạch hoặc một ý định trong tương lai.',
            conjugation: '- Gốc V có patchim -> `~으려고 하다`.\n- Gốc V không có patchim hoặc có patchim ㄹ -> `~려고 하다`.',
            examples: [
              { korean: '주말에 영화를 보려고 해요.', romanization: 'jumal-e yeonghwaleul bolyeogo haeyo.', vietnamese: 'Tôi định cuối tuần sẽ xem phim.' },
            ],
          },
          {
            pattern: 'V + ~(으)ㄹ 겸',
            meaning: 'Nhân tiện/Tiện thể...',
            explanation: 'Diễn tả việc thực hiện một hành động với hai hoặc nhiều mục đích.',
            conjugation: '- Gốc V có patchim -> `~을 겸`.\n- Gốc V không có patchim hoặc có patchim ㄹ -> `~ㄹ 겸`.',
            examples: [
              { korean: '친구도 만날 겸 쇼핑도 할 겸 시내에 나갔어요.', romanization: 'chingudo mannal gyeom syopingdo hal gyeom sinaee nagass-eoyo.', vietnamese: 'Tôi ra phố để vừa gặp bạn vừa tiện thể mua sắm.'},
            ],
          },
          {
            pattern: 'V + ~고자',
            meaning: 'Để/Với ý định...',
            explanation: 'Diễn tả mục đích hoặc ý định một cách trang trọng, thường dùng trong văn viết hoặc phát biểu. Tương tự `~기 위해서`.',
            conjugation: 'Gốc V + `~고자`.',
            examples: [
              { korean: '저는 한국 문화를 더 깊이 이해하고자 한국에 왔습니다.', romanization: 'Jeoneun hanguk munhwareul deo gip-i ihae hagoja hangug-e wassseumnida.', vietnamese: 'Tôi đến Hàn Quốc với ý định tìm hiểu sâu hơn về văn hoá Hàn Quốc.' },
            ],
          },
          {
            pattern: 'V + ~도록 하다',
            meaning: 'Để cho/Khiến cho...',
            explanation: 'Diễn tả mục đích, để một kết quả nào đó xảy ra. Cũng có thể dùng để ra lệnh một cách gián tiếp.',
            conjugation: 'Gốc V + `~도록 하다`.',
            examples: [
              { korean: '모두가 들을 수 있도록 크게 말씀해 주세요.', romanization: 'moduga deul-eul su issdorok keuge malsseumhae juseyo.', vietnamese: 'Xin hãy nói to để cho mọi người đều có thể nghe được.' },
              { korean: '내일까지 이 일을 끝내도록 하세요.', romanization: 'naeilkkaji i il-eul kkeutnaedorok haseyo.', vietnamese: '(Hãy làm sao để) hoàn thành công việc này trước ngày mai.' },
            ],
          },
          {
            pattern: 'V + ~길래',
            meaning: 'Vì thấy/Vì... nên...',
            explanation: 'Dùng để chỉ một lý do hoặc một quan sát trực tiếp dẫn đến hành động của người nói ở mệnh đề sau.',
            conjugation: 'Gốc V/A + -았/었길래 (quá khứ), Gốc V + -길래 (hiện tại)',
            examples: [
              { korean: '백화점에서 세일을 하길래 옷을 몇 벌 샀어요.', romanization: 'Baekhwajeom-eseo se-il-eul hagillae os-eul myeot beol sasseoyo.', vietnamese: 'Vì thấy trung tâm thương mại đang giảm giá nên tôi đã mua mấy bộ quần áo.' },
            ],
          },
        ]
      },
      {
        categoryName: 'Thời gian & Trình tự (Nâng cao)',
        points: [
           {
            pattern: 'V + -자마자',
            meaning: 'Ngay sau khi...',
            explanation: 'Diễn tả một hành động xảy ra ngay lập tức sau khi hành động khác kết thúc.',
            conjugation: 'Gốc V + `~자마자`.',
            examples: [
              { korean: '수업이 끝나자마자 집에 갔어요.', romanization: 'sueob-i kkeutnajamaja jib-e gasseoyo.', vietnamese: 'Ngay sau khi tan học, tôi đã về nhà.' },
            ],
          },
          {
            pattern: 'V + -고 나서',
            meaning: 'Sau khi làm gì đó',
            explanation: 'Nhấn mạnh sự hoàn thành của hành động trước rồi mới đến hành động sau. Chỉ dùng với động từ.',
            conjugation: 'Gốc V + `~고 나다`. Thường chia là `~고 나서`.',
            examples: [
              { korean: '숙제를 다 하고 나서 놀 거예요.', romanization: 'sugjeleul da hago naseo nol geoyeyo.', vietnamese: 'Sau khi làm xong hết bài tập, tôi sẽ đi chơi.' },
            ],
          },
           {
            pattern: 'V + ~다(가)',
            meaning: 'Đang... thì...',
            explanation: 'Diễn tả một hành động đang diễn ra thì bị một hành động khác xen vào.',
            conjugation: 'Gốc V + `다(가)`.',
            examples: [
              { korean: '길을 걷다가 친구를 만났어요.', romanization: 'gil-eul geod-daga chinguleul mannass-eoyo.', vietnamese: 'Đang đi trên đường thì tôi gặp bạn.' },
            ],
          },
          {
            pattern: 'V + -는 길에',
            meaning: 'Trên đường...',
            explanation: 'Diễn tả một hành động xảy ra trong quá trình di chuyển từ nơi này đến nơi khác.',
            conjugation: 'Gốc V + `~는 길에`.',
            examples: [
              { korean: '집에 오는 길에 슈퍼에 들렀어요.', romanization: 'jib-e oneun gil-e syupeo-e deulleoss-eoyo.', vietnamese: 'Trên đường về nhà, tôi đã ghé qua siêu thị.' },
            ],
          },
          {
            pattern: 'V + -는 동안',
            meaning: 'Trong khi / Trong suốt...',
            explanation: 'Diễn tả một khoảng thời gian mà một hành động nào đó diễn ra.',
            conjugation: 'Gốc V + `~는 동안`. Hoặc Danh từ + `~동안`.',
            examples: [
              { korean: '여행하는 동안 사진을 많이 찍었어요.', romanization: 'yeohaenghaneun dong-an sajin-eul manh-i jjig-eoss-eoyo.', vietnamese: 'Tôi đã chụp rất nhiều ảnh trong khi đi du lịch.' },
            ],
          },
          {
            pattern: 'V + -(으)려던 참이다',
            meaning: 'Đúng lúc định...',
            explanation: 'Diễn tả ý định sắp thực hiện một hành động thì có một sự việc khác xen vào.',
            conjugation: '- Gốc V có patchim -> `~으려던 참이다`.\n- Gốc V không có patchim hoặc có patchim ㄹ -> `~려던 참이다`.',
            examples: [
              { korean: '막 저녁을 먹으려던 참이었어요.', romanization: 'mak jeonyeog-eul meog-eulyeodeon cham-ieoss-eoyo.', vietnamese: 'Tôi đúng lúc đang định ăn tối.'},
            ],
          },
          {
            pattern: 'V + -(으)ㄴ 지',
            meaning: 'Từ khi... (đã bao lâu)',
            explanation: 'Diễn tả khoảng thời gian đã trôi qua kể từ khi một hành động xảy ra.',
            conjugation: 'Gốc V + `-(으)ㄴ 지` + Thời gian + 되다/넘다/지나다.',
            examples: [
              { korean: '한국에 온 지 1년이 되었어요.', romanization: 'hangug-e on ji 1nyeon-i doeeoss-eoyo.', vietnamese: 'Đã được 1 năm kể từ khi tôi đến Hàn Quốc.' },
            ],
          },
          {
            pattern: 'V + -는 대로',
            meaning: 'Ngay khi/Theo như',
            explanation: '1. Diễn tả một hành động xảy ra ngay sau hành động khác. 2. Diễn tả việc làm theo một chỉ dẫn.',
            conjugation: 'Gốc V + `~는 대로`.',
            examples: [
              { korean: '집에 도착하는 대로 전화해 주세요.', romanization: 'jib-e dochaghaneun daelo jeonhwahae juseyo.', vietnamese: 'Ngay khi về đến nhà, hãy gọi cho tôi.' },
              { korean: '선생님께서 말씀하시는 대로 적었어요.', romanization: 'seonsaengnimkkeseo malsseumhasineun daelo jeog-eoss-eoyo.', vietnamese: 'Tôi đã viết theo như những gì giáo viên nói.' },
            ],
          },
          {
            pattern: 'V + ~기(가) 무섭게',
            meaning: 'Vừa mới...thì ngay',
            explanation: 'Nhấn mạnh hành động thứ hai xảy ra gần như đồng thời hoặc ngay tức thì sau hành động thứ nhất, mạnh hơn cả `-자마자`.',
            conjugation: 'Gốc V + `~기(가) 무섭게`.',
            examples: [
              { korean: '그는 집에 도착하기가 무섭게 바로 잠이 들었다.', romanization: 'geuneun jib-e dochaghagiga museobge balo jam-i deul-eossda.', vietnamese: 'Anh ta vừa mới về đến nhà thì ngủ thiếp đi ngay.' },
            ],
          },
          {
            pattern: 'V + -는 한편',
            meaning: 'Một mặt thì..., mặt khác thì...',
            explanation: 'Dùng để trình bày hai hành động hoặc trạng thái xảy ra đồng thời nhưng ở hai khía cạnh khác nhau.',
            conjugation: 'Gốc V + `~는 한편`.',
            examples: [
              { korean: '그는 열심히 공부하는 한편, 동아리 활동도 적극적으로 참여한다.', romanization: 'Geuneun yeolsimhi gongbuhaneun hanpyeon, dong-ali hwaldongdo jeoggeugjeog-eulo cham-yeohanda.', vietnamese: 'Một mặt anh ấy học hành chăm chỉ, mặt khác cũng tích cực tham gia hoạt động câu lạc bộ.' },
            ],
          },
          {
            pattern: 'V + -기(가) 바쁘게',
            meaning: 'Vừa mới... thì ngay',
            explanation: 'Tương tự `~기 무섭게`, diễn tả hai hành động xảy ra liên tiếp một cách nhanh chóng.',
            conjugation: 'Gốc V + `~기(가) 바쁘게`.',
            examples: [
              { korean: '아침을 먹기가 바쁘게 집을 나섰다.', romanization: 'achim-eul meog-giga babbeuge jib-eul naseossda.', vietnamese: 'Vừa mới ăn sáng xong là đã vội vã ra khỏi nhà ngay.' },
            ],
          },
          {
            pattern: 'V + ~자',
            meaning: '...thì...',
            explanation: 'Một liên từ nối mang tính văn viết, diễn tả hành động thứ hai xảy ra ngay sau khi nhận ra kết quả của hành động thứ nhất.',
            conjugation: 'Gốc V + `~자`.',
            examples: [
              { korean: '창문을 열자 시원한 바람이 들어왔다.', romanization: 'changmun-eul yeolja siwonhan balam-i deul-eowassda.', vietnamese: 'Vừa mở cửa sổ ra thì một luồng gió mát ùa vào.' },
            ],
          },
        ]
      },
      {
        categoryName: 'Tường thuật gián tiếp (Đầy đủ)',
        points: [
          {
            pattern: 'V/A + -(ㄴ/는)다고 하다 (Trần thuật)',
            meaning: 'Nói rằng...',
            explanation: 'Dùng để thuật lại một câu trần thuật.',
            conjugation: '- ĐT có patchim: `~는다고`.\n- ĐT không có patchim: `~ㄴ다고`.\n- TT: `~다고`.\n- DT: `~(이)라고`.',
            examples: [
              { korean: '수진 씨가 오늘 바쁘다고 했어요.', romanization: 'Sujin-ssiga oneul bappeudago haesseoyo.', vietnamese: 'Sujin nói rằng hôm nay cô ấy bận.' },
              { korean: '민준 씨는 김치를 잘 먹는다고 했어요.', romanization: 'Minjun-ssineun kimchireul jal meongneundago haesseoyo.', vietnamese: 'Minjun nói rằng anh ấy ăn kim chi rất giỏi.' },
            ],
            notes: 'Rút gọn trong văn nói: `~대요`. Ví dụ: 바쁘대요, 먹는대요.'
          },
          {
            pattern: 'V/A + -았/었다고 하다 (Trần thuật Quá khứ)',
            meaning: 'Nói rằng đã...',
            explanation: 'Thuật lại câu trần thuật ở thì quá khứ.',
            conjugation: 'Gốc V/A + `~았/었다고 하다`.',
            examples: [
              { korean: '민준 씨가 어제 영화를 봤다고 했어요.', romanization: 'minjun ssiga eoje yeonghwaleul bwassdago haess-eoyo.', vietnamese: 'Minjun nói rằng hôm qua anh ấy đã xem phim.'},
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ 거라고 하다 (Trần thuật Tương lai)',
            meaning: 'Nói rằng sẽ...',
            explanation: 'Thuật lại câu trần thuật ở thì tương lai.',
            conjugation: 'Gốc V/A + `-(으)ㄹ 거라고 하다`.',
            examples: [
              { korean: '내일 비가 올 거라고 했어요.', romanization: 'naeil biga ol geolago haess-eoyo.', vietnamese: '(Họ) nói rằng ngày mai trời sẽ mưa.'},
            ],
          },
          {
            pattern: 'N + -(이)라고 하다 (Trần thuật Danh từ)',
            meaning: 'Nói rằng là...',
            explanation: 'Thuật lại câu trần thuật với danh từ.',
            conjugation: 'DT có patchim + `~이라고 하다`. DT không có patchim + `~라고 하다`.',
            examples: [
              { korean: '그 사람이 학생이라고 했어요.', romanization: 'geu salam-i hagsaeng-ilago haess-eoyo.', vietnamese: 'Người đó nói rằng anh ấy là học sinh.'},
            ],
          },
          {
            pattern: 'N + -이/가 아니라고 하다 (Trần thuật Phủ định)',
            meaning: 'Nói rằng không phải là...',
            explanation: 'Thuật lại câu phủ định với danh từ.',
            conjugation: '`~이/가 아니라고 하다`.',
            examples: [
              { korean: '저는 의사가 아니라고 말했어요.', romanization: 'jeoneun uisaga anilago malhaess-eoyo.', vietnamese: 'Tôi đã nói rằng tôi không phải là bác sĩ.'},
            ],
          },
          {
            pattern: 'V/A + -(으)냐고 묻다 (Câu hỏi)',
            meaning: 'Hỏi rằng...',
            explanation: 'Dùng để thuật lại một câu hỏi.',
            conjugation: '- Động từ: `~느냐고` (rút gọn: `~냐고`).\n- Tính từ: `~(으)냐고`.\n- Danh từ: `~(이)냐고`.',
            examples: [
              { korean: '엄마가 어디 가냐고 물어보셨어요.', romanization: 'Eommaga eodi ganyago mureobosyeosseoyo.', vietnamese: 'Mẹ đã hỏi rằng tôi đi đâu đấy.' },
              { korean: '친구가 한국 음식이 맵냐고 물었어요.', romanization: 'Chinguga hanguk eumsig-i maemnyago mul-eosseoyo.', vietnamese: 'Bạn tôi đã hỏi rằng đồ ăn Hàn Quốc có cay không.' },
            ],
            notes: 'Rút gọn trong văn nói: `~냬요`. Ví dụ: 가냬요, 맵냬요.'
          },
           {
            pattern: 'V/A + -았/었냐고 묻다 (Câu hỏi Quá khứ)',
            meaning: 'Hỏi rằng đã...',
            explanation: 'Thuật lại một câu hỏi ở thì quá khứ.',
            conjugation: 'Gốc V/A + `~았/었냐고 묻다`.',
            examples: [
              { korean: '친구가 숙제를 다 했냐고 물었어요.', romanization: 'chinguga sugjeleul da haessnyago mul-eoss-eoyo.', vietnamese: 'Bạn tôi đã hỏi rằng (tôi) đã làm xong bài tập chưa.'},
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ 거냐고 묻다 (Câu hỏi Tương lai)',
            meaning: 'Hỏi rằng sẽ...',
            explanation: 'Thuật lại một câu hỏi ở thì tương lai.',
            conjugation: 'Gốc V/A + `-(으)ㄹ 거냐고 묻다`.',
            examples: [
              { korean: '언제 출발할 거냐고 물었어요.', romanization: 'eonje chulbalhal geonyago mul-eoss-eoyo.', vietnamese: '(Họ) đã hỏi rằng khi nào sẽ xuất phát.'},
            ],
          },
          {
            pattern: 'N + -(이)냐고 묻다 (Câu hỏi Danh từ)',
            meaning: 'Hỏi rằng có phải là...',
            explanation: 'Thuật lại một câu hỏi với danh từ.',
            conjugation: 'DT có patchim + `~이냐고 묻다`. DT không có patchim + `~냐고 묻다`.',
            examples: [
              { korean: '그 사람이 한국 사람이냐고 물었어요.', romanization: 'geu salam-i hangug salam-inyago mul-eoss-eoyo.', vietnamese: '(Tôi) đã hỏi rằng người đó có phải là người Hàn Quốc không.'},
            ],
          },
          {
            pattern: 'V + -(으)라고 하다 (Mệnh lệnh)',
            meaning: 'Bảo rằng hãy...',
            explanation: 'Dùng để thuật lại một câu yêu cầu, mệnh lệnh.',
            conjugation: '- ĐT có patchim: `~으라고 하다`.\n- ĐT không có patchim: `~라고 하다`.',
            examples: [
              { korean: '선생님께서 조용히 하라고 하셨어요.', romanization: 'Seonsaengnimkkeseo joyonghi harago hasyeosseoyo.', vietnamese: 'Thầy giáo đã bảo rằng hãy giữ yên lặng.' },
            ],
             notes: 'Rút gọn trong văn nói: `~래요`. Ví dụ: 조용히 하래요.'
          },
          {
            pattern: 'V + -지 말라고 하다 (Mệnh lệnh Phủ định)',
            meaning: 'Bảo rằng đừng...',
            explanation: 'Thuật lại một câu mệnh lệnh phủ định.',
            conjugation: 'Gốc V + `-지 말라고 하다`.',
            examples: [
                { korean: '엄마가 게임을 하지 말라고 했어요.', romanization: 'eommaga geim-eul haji mallago haess-eoyo.', vietnamese: 'Mẹ đã bảo rằng đừng chơi game.' },
            ],
          },
          {
            pattern: 'V + -아/어 달라고/주라고 하다 (Yêu cầu)',
            meaning: 'Bảo hãy làm gì cho ai',
            explanation: 'Dùng `달라고` khi người nói là người nhận hành động. Dùng `주라고` khi người nhận là một người thứ ba.',
            conjugation: 'Gốc V + `~아/어 달라고/주라고 하다`.',
            examples: [
                { korean: '동생이 나에게 물 좀 갖다 달라고 했어요.', romanization: 'dongsaeng-i na-ege mul jom gajda dallago haess-eoyo.', vietnamese: 'Em tôi đã bảo tôi lấy cho nó chút nước.' },
                { korean: '민준 씨가 수진 씨에게 책을 빌려주라고 했어요.', romanization: 'minjun ssiga sujin ssi-ege chaeg-eul billyeojulago haess-eoyo.', vietnamese: 'Minjun đã bảo (tôi) cho Sujin mượn sách.' },
            ],
          },
          {
            pattern: 'V + -자고 하다 (Rủ rê)',
            meaning: 'Rủ rằng hãy cùng...',
            explanation: 'Dùng để thuật lại một lời đề nghị, rủ rê.',
            conjugation: 'Gốc V + `~자고 하다`.',
            examples: [
              { korean: '친구가 같이 영화를 보자고 했어요.', romanization: 'Chinguga gachi yeonghwa-reul bojago haesseoyo.', vietnamese: 'Bạn tôi đã rủ rằng hãy cùng nhau xem phim.' },
            ],
            notes: 'Rút gọn trong văn nói: `~재요`. Ví dụ: 보자재요.'
          },
          {
            pattern: 'V + -지 말자고 하다 (Rủ rê Phủ định)',
            meaning: 'Rủ rằng đừng...',
            explanation: 'Thuật lại một lời rủ rê phủ định.',
            conjugation: 'Gốc V + `-지 말자고 하다`.',
            examples: [
                { korean: '수진 씨가 여기에서 먹지 말자고 했어요.', romanization: 'sujin ssiga yeogieseo meogji maljago haess-eoyo.', vietnamese: 'Sujin đã rủ rằng chúng ta đừng ăn ở đây.'},
            ],
          },
          {
            pattern: 'V/A + -다고요? (Hỏi lại)',
            meaning: '(Bạn nói là)... á?',
            explanation: 'Dùng để hỏi lại, xác nhận lại thông tin vừa nghe với vẻ ngạc nhiên.',
            conjugation: 'Gốc V/A + `~다고요?` (chia theo quy tắc tường thuật trần thuật).',
            examples: [
              { korean: 'A: 민준 씨가 결혼했어요. B: 네? 결혼했다고요?', romanization: 'A: minjun ssiga gyeolhonhaess-eoyo. B: ne? gyeolhonhaessdagoyo?', vietnamese: 'A: Anh Minjun kết hôn rồi. B: Gì cơ? Anh ấy kết hôn rồi á?' },
            ],
          },
          {
            pattern: 'V/A + ~다니 (Ngạc nhiên)',
            meaning: 'Thật không thể tin là...',
            explanation: 'Diễn tả sự ngạc nhiên, không thể tin được khi nghe một thông tin nào đó.',
            conjugation: 'Gốc V/A + `~다니` (chia theo quy tắc tường thuật trần thuật).',
            examples: [
              { korean: '그가 벌써 결혼했다니 믿을 수가 없어요.', romanization: 'geuga beolsseo gyeolhonhaessdani mid-eul suga eobs-eoyo.', vietnamese: 'Thật không thể tin được là anh ấy đã kết hôn rồi.' },
            ],
          },
          {
            pattern: 'V/A + -다는 것 (Danh từ hoá)',
            meaning: 'Việc mà.../Sự thật là...',
            explanation: 'Dùng để danh từ hóa một mệnh đề tường thuật, biến nó thành một cụm danh từ.',
            conjugation: 'Chia như câu tường thuật trần thuật rồi thay `~고 하다` bằng `~는 것`.',
            examples: [
              { korean: '그가 천재라는 것을 모두가 알고 있어요.', romanization: 'geuga cheonjaelaneun geos-eul moduga algo iss-eoyo.', vietnamese: 'Mọi người đều biết việc anh ấy là một thiên tài.' },
            ],
          },
          {
            pattern: 'V/A + -다는 소문/이야기 (Trích dẫn)',
            meaning: 'Tin đồn/câu chuyện rằng...',
            explanation: 'Dùng để trích dẫn một tin đồn hoặc một câu chuyện.',
            conjugation: 'Chia như câu tường thuật trần thuật rồi thay `~고 하다` bằng `~는 소문/이야기`.',
            examples: [
              { korean: '두 사람이 헤어졌다는 소문을 들었어요.', romanization: 'du salam-i heeojyeossdaneun somun-eul deul-eoss-eoyo.', vietnamese: 'Tôi đã nghe tin đồn rằng hai người đó đã chia tay.' },
            ],
          },
          {
            pattern: 'V/A + ~는다고 치다',
            meaning: 'Cứ cho là... / Giả sử là...',
            explanation: 'Dùng để đưa ra một giả định (dù có thể không thật) để làm tiền đề cho mệnh đề sau.',
            conjugation: 'Gốc V/A + `~는다고 치다` (tính từ là `~다고 치다`).',
            examples: [
              { korean: '백만 원이 있다고 치고 뭘 사고 싶어요?', romanization: 'baegman won-i issdagochigo mwol sago sip-eoyo?', vietnamese: 'Giả sử là có 1 triệu won, bạn muốn mua gì?' },
            ],
          },
        ]
      },
      {
        categoryName: 'Phỏng đoán & Suy luận (Nâng cao)',
        points: [
           {
            pattern: 'V/A + -나 보다 / -(으)ㄴ가 보다',
            meaning: 'Có vẻ là / Chắc là',
            explanation: 'Dùng để diễn tả một sự phỏng đoán dựa trên một bằng chứng hoặc tình huống mà người nói quan sát được.',
            conjugation: '- Động từ: Gốc V + `나 보다`.\n- Tính từ có patchim: Gốc A + `은가 보다`.\n- Tính từ không có patchim: Gốc A + `ㄴ가 보다`.',
            examples: [
                { korean: '밖에 비가 오나 봐요.', romanization: 'bakk-e biga ona bwayo.', vietnamese: 'Có vẻ như ngoài trời đang mưa.' },
                { korean: '저 사람은 돈이 많은가 봐요.', romanization: 'jeo saram-eun don-i manh-eunga bwayo.', vietnamese: 'Người kia chắc là có nhiều tiền.' },
            ],
          },
           {
            pattern: 'V/A + -(으)ㄹ 텐데',
            meaning: 'Chắc là sẽ... nhưng/nên...',
            explanation: '1. Diễn tả sự phỏng đoán về một tình huống, theo sau là một sự thật hoặc cảm xúc trái ngược. 2. Diễn tả sự phỏng đoán làm tiền đề cho một lời đề nghị hoặc gợi ý.',
            conjugation: '- Gốc V/A có patchim -> `~을 텐데`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~ㄹ 텐데`.',
            examples: [
              { korean: '지금 가면 차가 막힐 텐데 지하철을 타는 게 어때요?', romanization: 'Jigeum gamyeon chaga makhil tende jihacheol-eul taneun ge eottaeyo?', vietnamese: 'Bây giờ đi chắc là sẽ kẹt xe đấy, hay là chúng ta đi tàu điện ngầm đi?' },
              { korean: '그 사람은 부자일 텐데, 옷은 평범하게 입네요.', romanization: 'Geu saram-eun bujail tende, os-eun pyeongbeomhage imneyo.', vietnamese: 'Người đó chắc là giàu lắm, nhưng mà lại ăn mặc thật bình thường.' },
            ],
          },
           {
            pattern: 'V/A + -(으)ㄹ걸요',
            meaning: 'Chắc là... / Có lẽ...',
            explanation: 'Dùng để phỏng đoán một cách nhẹ nhàng, hoặc để chỉnh lại một cách mềm mỏng ý kiến của người khác.',
            conjugation: '- Gốc V/A có patchim -> `~을걸요`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~ㄹ걸요`.',
            examples: [
              { korean: 'A: 민준 씨가 지금 회사에 있을까요? B: 아마 집에 갔을걸요.', romanization: 'A: minjun ssiga jigeum hoesa-e iss-eulkkayo? B: ama jib-e gass-eulgeol-yo.', vietnamese: 'A: Liệu Minjun có ở công ty không? B: Chắc là anh ấy về nhà rồi.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ 모양이다',
            meaning: 'Trông có vẻ / Hình như là',
            explanation: 'Diễn tả sự phỏng đoán dựa trên một tình huống hoặc vẻ ngoài quan sát được, tương tự `-(으)ㄴ/는 것 같다`.',
            conjugation: 'Gốc V/A + `-(으)ㄹ 모양이다`.',
            examples: [
              { korean: '하늘을 보니 곧 비가 올 모양이다.', romanization: 'haneul-eul boni god biga ol moyang-ida.', vietnamese: 'Nhìn trời thì hình như sắp mưa.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ 뻔하다',
            meaning: 'Suýt nữa thì...',
            explanation: 'Diễn tả một việc suýt xảy ra nhưng cuối cùng đã không xảy ra.',
            conjugation: 'Gốc V + `-(으)ㄹ 뻔하다`. Luôn dùng ở thì quá khứ.',
            examples: [
                { korean: '늦잠을 자서 기차를 놓칠 뻔했어요.', romanization: 'neujjam-eul jaseo gichaleul nohchil ppeonhaess-eoyo.', vietnamese: 'Vì ngủ quên nên tôi đã suýt lỡ chuyến tàu.' },
            ],
          },
          {
            pattern: 'V + -(으)ㄹ까 하다',
            meaning: 'Đang nghĩ là sẽ...',
            explanation: 'Diễn tả một ý định hoặc kế hoạch còn mơ hồ, chưa chắc chắn.',
            conjugation: 'Gốc V + `-(으)ㄹ까 하다`.',
            examples: [
              { korean: '주말에 영화나 볼까 해요.', romanization: 'jumal-e yeonghwana bolkka haeyo.', vietnamese: 'Cuối tuần tôi đang nghĩ là hay là đi xem phim.' },
            ],
          },
          {
            pattern: 'V + -(으)려나 보다',
            meaning: 'Chắc là sắp / Hình như định...',
            explanation: 'Kết hợp giữa ý định `-(으)려고 하다` và phỏng đoán `~나 보다` để suy đoán về ý định hoặc hành động sắp xảy ra của người khác.',
            conjugation: 'Gốc V + `-(으)려나 보다`.',
            examples: [
              { korean: '아이가 자꾸 우는 걸 보니 배가 고프려나 봐요.', romanization: 'aiga jakku uneun geol boni baega gopeulyeona bwayo.', vietnamese: 'Thấy đứa bé cứ khóc miết, chắc là nó đói rồi.' },
            ],
          },
          {
            pattern: 'V/A + -았/었어야 했는데',
            meaning: 'Lẽ ra đã phải... (nhưng đã không)',
            explanation: 'Diễn tả sự hối tiếc hoặc tiếc nuối về một việc lẽ ra phải làm trong quá khứ nhưng đã không làm.',
            conjugation: 'Gốc V/A + `~았/었어야 했는데`.',
            examples: [
              { korean: '어제 시험이 있었는데, 더 열심히 공부했어야 했는데...', romanization: 'eoje siheom-i iss-eossneunde, deo yeolsimhi gongbuhaess-eoya haessneunde...', vietnamese: 'Hôm qua có bài kiểm tra, lẽ ra tôi đã phải học chăm chỉ hơn...' },
            ],
          },
        ]
      },
      {
        categoryName: 'Bối cảnh, Tương phản & Nhượng bộ (Nâng cao)',
        points: [
          {
            pattern: 'V/A + -(으)ㄴ/는데',
            meaning: 'Bối cảnh / Tương phản',
            explanation: 'Một trong những liên từ nối câu quan trọng nhất. 1. Đưa ra bối cảnh cho mệnh đề sau. 2. Thể hiện sự tương phản nhẹ nhàng.',
            conjugation: '- Động từ: `~는데`\n- Tính từ có patchim: `~은데`\n- Tính từ không có patchim: `~ㄴ데`\n- Danh từ: `~인데`',
            examples: [
              { korean: '어제 영화를 봤는데, 아주 재미있었어요.', romanization: 'eoje yeonghwaleul bwassneunde, aju jaemiiss-eoss-eoyo.', vietnamese: 'Hôm qua tôi đã xem phim, và nó rất hay. (bối cảnh)'},
              { korean: '저는 학생인데, 동생은 회사원이에요.', romanization: 'jeoneun hagsaeng-inde, dongsaeng-eun hoesawon-ieyo.', vietnamese: 'Tôi là học sinh, còn em tôi là nhân viên văn phòng. (tương phản)'},
            ],
          },
           {
            pattern: 'V/A + -잖아요',
            meaning: '...mà/chẳng phải là... sao?',
            explanation: 'Dùng để xác nhận lại một thông tin mà cả người nói và người nghe đều đã biết, hoặc để giải thích một lý do hiển nhiên.',
            conjugation: 'Gốc V/A + `~잖아요`.',
            examples: [
              { korean: '걱정하지 마세요. 시간은 아직 많이 있잖아요.', romanization: 'geokjeonghaji maseyo. sigan-eun ajig manh-i issjanh-ayo.', vietnamese: 'Đừng lo. Chẳng phải là chúng ta vẫn còn nhiều thời gian sao?' },
            ],
          },
          {
            pattern: 'V/A + ~군요 / ~는군요 / ~구나',
            meaning: 'Hóa ra là... (Cảm thán)',
            explanation: 'Diễn tả sự nhận ra hoặc ngạc nhiên về một sự thật mới sau khi nghe, đọc hoặc suy luận.',
            conjugation: '- Tính từ: `~군요`/`~구나`\n- Động từ: `~는군요`/`~는구나`',
            examples: [
              { korean: '한국말을 정말 잘하시는군요!', romanization: 'hangugmal-eul jeongmal jalhasineungun-yo!', vietnamese: 'Hóa ra là bạn nói tiếng Hàn giỏi thật đấy!' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄴ/는 반면에',
            meaning: 'Trái lại, mặt khác',
            explanation: 'Dùng để giới thiệu hai sự thật đối lập về cùng một đối tượng.',
            conjugation: '- Động từ: `~는 반면에`.\n- Tính từ có patchim: `~은 반면에`.\n- Tính từ không có patchim: `~ㄴ 반면에`.',
            examples: [
              { korean: '지하철은 빠른 반면에 아침에는 사람이 너무 많아요.', romanization: 'jihacheol-eun ppaleun banmyeon-e achim-eneun salam-i neomu manh-ayo.', vietnamese: 'Tàu điện ngầm thì nhanh, nhưng trái lại vào buổi sáng thì quá đông người.' },
            ]
          },
          {
            pattern: 'V/A + ~더니',
            meaning: '...rồi.../Vì...nên...',
            explanation: '1. Diễn tả một sự thật người nói quan sát được trong quá khứ, và một kết quả tương phản ở hiện tại. 2. Diễn tả nguyên nhân (quan sát được) và kết quả.',
            conjugation: 'Gốc V/A + `~더니`.',
            examples: [
              { korean: '아까는 날씨가 좋더니 지금은 비가 오네요.', romanization: 'akkaneun nalssiga johdeoni jigeum-eun biga oneyo.', vietnamese: 'Ban nãy thời tiết đẹp thế mà bây giờ lại mưa.' },
              { korean: '친구가 열심히 공부하더니 시험에 합격했어요.', romanization: 'chinguga yeolsimhi gongbuhadeoni siheom-e habgyeoghaess-eoyo.', vietnamese: 'Vì (tôi thấy) bạn tôi học chăm chỉ nên đã đỗ kỳ thi.' },
            ],
            notes: 'Chủ ngữ của hai mệnh đề phải khác nhau khi chỉ sự tương phản, nhưng phải giống nhau khi chỉ nguyên nhân.'
          },
          {
            pattern: 'V/A + -(으)ㄹ 뿐만 아니라',
            meaning: 'Không những... mà còn...',
            explanation: 'Dùng để bổ sung thông tin theo hướng tích cực, liệt kê thêm một đặc điểm/hành động nữa.',
            conjugation: '- Gốc V/A có patchim -> `~을 뿐만 아니라`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~ㄹ 뿐만 아니라`.',
            examples: [
              { korean: '그 가수는 노래를 잘할 뿐만 아니라 춤도 잘 춰요.', romanization: 'geu gasuneun nolaeleul jalhal ppunman anila chumdo jal chwoyo.', vietnamese: 'Ca sĩ đó không những hát hay mà còn nhảy giỏi.' },
            ],
          },
          {
            pattern: 'V/A + -아/어도',
            meaning: 'Dù/Cho dù... thì vẫn...',
            explanation: 'Diễn tả hành động ở mệnh đề sau vẫn xảy ra bất chấp điều kiện ở mệnh đề trước.',
            conjugation: 'Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `도`.',
            examples: [
              { korean: '비가 많이 와도 저는 학교에 갈 거예요.', romanization: 'biga manh-i wado jeoneun haggyoe gal geoyeyo.', vietnamese: 'Cho dù trời mưa nhiều, tôi vẫn sẽ đến trường.'},
            ],
          },
          {
            pattern: 'V/A + ~더라도',
            meaning: 'Dù cho... đi chăng nữa',
            explanation: 'Diễn tả sự nhượng bộ mạnh mẽ, một giả định ít có khả năng xảy ra hơn so với `~아/어도`.',
            conjugation: 'Gốc V/A + `~더라도`.',
            examples: [
              { korean: '부모님께서 반대하시더라도 저는 그 사람과 결혼할 거예요.', romanization: 'bumonimkkeseo bandaehasideolado jeoneun geu salamgwa gyeolhonhal geoyeyo.', vietnamese: 'Dù cho bố mẹ có phản đối đi chăng nữa, tôi vẫn sẽ cưới người đó.'},
            ],
          },
          {
            pattern: 'V + -는 대신에',
            meaning: 'Thay vì/Đổi lại',
            explanation: 'Diễn tả sự thay thế hoặc đền bù cho một hành động/trạng thái khác.',
            conjugation: 'Gốc V + `~는 대신에`.',
            examples: [
              { korean: '영화를 보는 대신에 집에서 책을 읽었어요.', romanization: 'yeonghwaleul boneun daesin-e jib-eseo chaeg-eul ilg-eoss-eoyo.', vietnamese: 'Thay vì xem phim, tôi đã đọc sách ở nhà.'},
              { korean: '제가 청소하는 대신에 요리해 줄래요?', romanization: 'jega cheongsohaneun daesin-e yolihae jullaeyo?', vietnamese: 'Để tôi dọn dẹp, đổi lại bạn nấu ăn cho tôi nhé?'},
            ],
          },
        ]
      },
      {
        categoryName: 'Trạng thái, Hoàn thành & Thay đổi',
        points: [
           {
            pattern: 'V + ~아/어 놓다/두다',
            meaning: 'Làm gì đó sẵn / duy trì trạng thái',
            explanation: 'Diễn tả việc hoàn thành một hành động và duy trì kết quả của nó.',
            conjugation: 'Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `놓다` hoặc `두다`.',
            examples: [
              { korean: '손님들이 오시기 전에 음식을 미리 만들어 놓았어요.', romanization: 'Sonnimdeul-i osigi jeon-e eumsig-eul miri mandeureo nohasseoyo.', vietnamese: 'Tôi đã làm sẵn đồ ăn trước khi khách đến.' },
              { korean: '창문을 열어 두세요.', romanization: 'Changmun-eul yeoreo duseyo.', vietnamese: 'Xin hãy cứ để cửa sổ mở.' },
            ],
          },
          {
            pattern: 'V + ~아/어 버리다',
            meaning: '...mất rồi / ...xong rồi',
            explanation: 'Diễn tả một hành động đã hoàn thành một cách triệt để, thường mang sắc thái tiếc nuối hoặc nhẹ nhõm.',
            conjugation: 'Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `버리다`.',
            examples: [
              { korean: '지갑을 잃어버렸어요.', romanization: 'Jigab-eul ilh-eobeoryeosseoyo.', vietnamese: 'Tôi đã làm mất ví rồi. (tiếc nuối)' },
              { korean: '어려운 숙제를 다 해 버렸어요.', romanization: 'Eoryeoun sukje-reul da hae beoryeosseoyo.', vietnamese: 'Tôi đã làm xong hết bài tập khó rồi. (nhẹ nhõm)' },
            ],
          },
           {
            pattern: 'V + ~고 말다',
            meaning: 'Cuối cùng thì...',
            explanation: 'Diễn tả một hành động cuối cùng cũng xảy ra, thường là trái với ý muốn hoặc sau một quá trình.',
            conjugation: 'Gốc V + `~고 말다`. Thường dùng ở thì quá khứ.',
            examples: [
              { korean: '오랫동안 찾았지만 결국 못 찾고 말았어요.', romanization: 'olaesdong-an chaj-assjiman gyeolgug mos chajgo mal-ass-eoyo.', vietnamese: 'Tôi đã tìm rất lâu nhưng cuối cùng đã không thể tìm thấy.' },
            ],
          },
          {
            pattern: 'V + -아/어 있다',
            meaning: 'Trạng thái kết quả',
            explanation: 'Diễn tả một trạng thái là kết quả của một hành động đã hoàn tất và vẫn đang tiếp diễn.',
            conjugation: 'Chủ yếu dùng với một số nội động từ. Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `있다`.',
            examples: [
              { korean: '학생들이 교실에 앉아 있어요.', romanization: 'hagsaengdeul-i gyosil-e anj-a isseoyo.', vietnamese: 'Các học sinh đang ngồi trong lớp (đang ở trong trạng thái ngồi).'},
              { korean: '문이 열려 있어요.', romanization: 'mun-i yeollyeo isseoyo.', vietnamese: 'Cánh cửa đang ở trong trạng thái mở.'},
            ],
            notes: 'Phân biệt với `~고 있다` (đang làm): `앉고 있다` (đang trong quá trình ngồi xuống), `앉아 있다` (đã ngồi xuống và đang ở trong trạng thái ngồi).'
          },
           {
            pattern: 'V + -(으)ㄴ 채(로)',
            meaning: 'Trong khi vẫn...',
            explanation: 'Diễn tả hành động thứ hai được thực hiện trong khi trạng thái của hành động thứ nhất vẫn được duy trì.',
            conjugation: '- Gốc V có patchim -> `~은 채로`.\n- Gốc V không có patchim hoặc có patchim ㄹ -> `~ㄴ 채로`.',
            examples: [
              { korean: '안경을 쓴 채로 잠이 들었어요.', romanization: 'angyeong-eul sseun chaelo jam-i deul-eoss-eoyo.', vietnamese: 'Tôi đã ngủ thiếp đi trong khi vẫn đang đeo kính.' },
            ],
          },
          {
            pattern: 'A + -아/어지다',
            meaning: 'Trở nên...',
            explanation: 'Gắn vào sau tính từ để diễn tả một trạng thái thay đổi.',
            conjugation: 'Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `지다`.',
            examples: [
              { korean: '날씨가 따뜻해졌어요.', romanization: 'nalssiga ttatteushaejyeoss-eoyo.', vietnamese: 'Thời tiết đã trở nên ấm áp.' },
            ],
          },
          {
            pattern: 'V + -게 되다',
            meaning: 'Trở nên/Dẫn đến...',
            explanation: 'Diễn tả một sự thay đổi hoặc một kết quả xảy ra một cách tự nhiên hoặc không phụ thuộc vào ý chí.',
            conjugation: 'Gốc V + `~게 되다`.',
            examples: [
              { korean: '저는 한국 회사에서 일하게 되었어요.', romanization: 'jeoneun hangug hoesa-eseo ilhage doeeoss-eoyo.', vietnamese: 'Tôi đã (được) đến làm việc ở công ty Hàn Quốc (không phải dự định ban đầu).'},
            ],
          },
          {
            pattern: 'V + -아/어 가다/오다',
            meaning: 'Dần dần...',
            explanation: 'Diễn tả một hành động hoặc trạng thái đang dần dần tiến triển. `-아/어 가다` hướng ra xa người nói (tương lai), `-아/어 오다` hướng về phía người nói (quá khứ đến hiện tại).',
            conjugation: 'Chia như thì hiện tại `~아요/어요` rồi thay `요` bằng `가다` hoặc `오다`.',
            examples: [
              { korean: '문제가 점점 해결되어 가고 있어요.', romanization: 'munjega jeomjeom haegyeoldoe-eo gago iss-eoyo.', vietnamese: 'Vấn đề đang dần dần được giải quyết (hướng tới tương lai).' },
              { korean: '지금까지 열심히 공부해 왔어요.', romanization: 'jigeumkkaji yeolsimhi gongbuhae wass-eoyo.', vietnamese: 'Cho đến bây giờ tôi đã học hành chăm chỉ (từ quá khứ đến nay).' },
            ],
          },
          {
            pattern: 'V/A + -아/어지다 (Bị động)',
            meaning: 'Bị/Được...',
            explanation: 'Một cách để tạo câu bị động cho một số ngoại động từ.',
            conjugation: 'Gốc V + `~아/어지다`.',
            examples: [
              { korean: '글씨가 잘 안 써져요.', romanization: 'geulssiga jal an sseojyeoyo.', vietnamese: 'Chữ không được viết ra một cách trôi chảy.'},
            ],
          },
        ]
      },
      {
        categoryName: 'Nghĩa vụ, Khả năng & Quyền lợi',
        points: [
           {
            pattern: 'V + -(으)면 안 되다',
            meaning: 'Không được phép...',
            explanation: 'Diễn tả sự cấm đoán.',
            conjugation: 'Gốc V + `-(으)면 안 되다`.',
            examples: [
              { korean: '박물관에서 사진을 찍으면 안 돼요.', romanization: 'bagmulgwan-eseo sajin-eul jjig-eumyeon an dwaeyo.', vietnamese: 'Không được chụp ảnh trong bảo tàng.'},
            ],
          },
          {
            pattern: 'V/A + -을 줄 알다/모르다',
            meaning: 'Biết/Không biết cách...',
            explanation: 'Diễn tả khả năng hoặc kỹ năng làm một việc gì đó.',
            conjugation: 'Gốc V/A + `~을 줄 알다/모르다`.',
            examples: [
              { korean: '저는 운전할 줄 알아요.', romanization: 'jeoneun unjeonhal jul al-ayo.', vietnamese: 'Tôi biết lái xe.' },
              { korean: '저는 김치를 만들 줄 몰라요.', romanization: 'jeoneun gimchileul mandeul jul mollayo.', vietnamese: 'Tôi không biết cách làm kim chi.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ 수밖에 없다',
            meaning: 'Đành phải/Chỉ có thể...',
            explanation: 'Diễn tả việc không có lựa chọn nào khác ngoài việc phải làm một hành động nào đó.',
            conjugation: '- Gốc V/A có patchim -> `~을 수밖에 없다`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~ㄹ 수밖에 없다`.',
            examples: [
              { korean: '돈이 없어서 아르바이트를 할 수밖에 없어요.', romanization: 'don-i eobs-eoseo aleubaiteuleul hal subakk-e eobs-eoyo.', vietnamese: 'Vì không có tiền nên tôi đành phải đi làm thêm.'},
            ],
          },
          {
            pattern: 'V + -(으)ㄹ 필요가 있다/없다',
            meaning: 'Cần/Không cần phải...',
            explanation: 'Diễn tả sự cần thiết hoặc không cần thiết của một hành động.',
            conjugation: 'Gốc V + `-(으)ㄹ 필요가 있다/없다`.',
            examples: [
              { korean: '걱정할 필요가 없어요.', romanization: 'geogjeonghal pil-yoga eobs-eoyo.', vietnamese: 'Bạn không cần phải lo lắng.' },
            ],
          },
        ]
      },
      {
        categoryName: 'Mức độ & So sánh (Nâng cao)',
        points: [
           {
            pattern: 'V/A + -(으)ㄹ수록',
            meaning: 'Càng... càng...',
            explanation: 'Diễn tả sự thay đổi của mệnh đề sau tương ứng với sự thay đổi của mệnh đề trước.',
            conjugation: '- Gốc V/A có patchim -> `~을수록`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~ㄹ수록`.',
            examples: [
              { korean: '한국어는 공부할수록 재미있어요.', romanization: 'hangugeo-neun gongbuhalsulog jaemiiss-eoyo.', vietnamese: 'Tiếng Hàn càng học càng thú vị.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ 정도로',
            meaning: 'Đến mức...',
            explanation: 'Diễn tả mức độ của một hành động hoặc trạng thái bằng cách so sánh với một hành động/trạng thái khác.',
            conjugation: 'Gốc V/A + `-(으)ㄹ 정도로`.',
            examples: [
              { korean: '어제는 너무 피곤해서 말도 못 할 정도로 잠이 들었어요.', romanization: 'eoje-neun neomu pigonhaeseo maldo mos hal jeongdolo jam-i deul-eoss-eoyo.', vietnamese: 'Hôm qua tôi mệt đến mức không thể nói được lời nào và đã ngủ thiếp đi.' },
            ],
          },
          {
            pattern: 'N + 만큼 / V/A + -(으)ㄴ/는/(으)ㄹ 만큼',
            meaning: 'Bằng/Như là/Tương xứng với...',
            explanation: 'Diễn tả sự tương đương về mức độ, số lượng hoặc hành động.',
            conjugation: '1. N + `만큼`\n2. V + `-(으)ㄴ` (quá khứ), `~는` (hiện tại), `~(으)ㄹ` (tương lai) + `만큼`.',
            examples: [
              { korean: '저도 민준 씨만큼 한국어를 잘하고 싶어요.', romanization: 'jeodo minjun ssimankeum hangugeo-reul jalhago sip-eoyo.', vietnamese: 'Tôi cũng muốn giỏi tiếng Hàn như anh Minjun.' },
              { korean: '노력한 만큼 결과가 나올 거예요.', romanization: 'nolyeoghan mankeum gyeolgwaga naol geoyeyo.', vietnamese: 'Sẽ có kết quả tốt tương xứng với sự nỗ lực đã bỏ ra.' },
            ],
          },
          {
            pattern: 'N + 에 비해서',
            meaning: 'So với...',
            explanation: 'Dùng để so sánh một đối tượng với một tiêu chuẩn hoặc đối tượng khác. Tương tự `~보다`.',
            conjugation: 'N + `~에 비해서`.',
            examples: [
              { korean: '가격에 비해서 품질이 아주 좋아요.', romanization: 'gagyeog-e bihaeseo pumjil-i aju joh-ayo.', vietnamese: 'So với giá cả thì chất lượng rất tốt.' },
            ],
          },
           {
            pattern: 'N + 만 못하다',
            meaning: 'Không bằng...',
            explanation: 'Dùng để so sánh kém hơn.',
            conjugation: 'N1 + `은/는` + N2 + `만 못하다`.',
            examples: [
              { korean: '아무리 비싼 음식도 어머니의 음식만 못하다.', romanization: 'amuli bissan eumsigdo eomeoniui eumsigman moshada.', vietnamese: 'Đồ ăn dù đắt đến mấy cũng không bằng đồ ăn của mẹ.' },
            ],
          },
          {
            pattern: 'N + -(이)라도',
            meaning: 'Dù chỉ là/Ít nhất là...',
            explanation: 'Dùng để chỉ một lựa chọn không phải là tốt nhất nhưng vẫn chấp nhận được.',
            conjugation: '- Danh từ có patchim: `~이라도`.\n- Danh từ không có patchim: `~라도`.',
            examples: [
              { korean: '시간이 없으면 커피라도 한잔할까요?', romanization: 'sigan-i eobs-eumyeon keopilado hanjanhalkkayo?', vietnamese: 'Nếu không có thời gian thì chúng ta uống tạm một tách cà phê nhé?' },
            ]
          },
        ]
      },
      {
        categoryName: 'Các cấu trúc khác (Nâng cao)',
        points: [
          {
            pattern: 'V/A + -(으)ㄴ/는 척하다 (체하다)',
            meaning: 'Giả vờ...',
            explanation: 'Diễn tả hành động giả vờ làm gì đó hoặc có trạng thái nào đó.',
            conjugation: '- Động từ: `~는 척하다`.\n- Tính từ: `~(으)ㄴ 척하다`.',
            examples: [
              { korean: '그는 모든 것을 아는 척해요.', romanization: 'geuneun modeun geos-eul aneun cheoghaeyo.', vietnamese: 'Anh ta giả vờ như biết mọi thứ.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄴ/는 셈이다',
            meaning: 'Coi như là/Gần như là...',
            explanation: 'Diễn tả một kết quả gần như hoặc có thể được coi là tương đương với một sự thật nào đó.',
            conjugation: '- Động từ: `~는 셈이다`.\n- Tính từ: `~(으)ㄴ 셈이다`.',
            examples: [
              { korean: '하루에 8시간씩 일하니까 인생의 3분의 1을 회사에서 보내는 셈이다.', romanization: 'halue 8siganssig ilhanikka insaeng-ui 3bun-ui 1-eul hoesa-eseo bonaeneun sem-ida.', vietnamese: 'Vì làm việc 8 tiếng mỗi ngày nên coi như là tôi dành 1/3 cuộc đời ở công ty.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ 뿐이다',
            meaning: 'Chỉ là... mà thôi',
            explanation: 'Nhấn mạnh rằng đó là hành động hoặc trạng thái duy nhất, không có gì hơn.',
            conjugation: '- Gốc V/A có patchim -> `~을 뿐이다`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~ㄹ 뿐이다`.',
            examples: [
              { korean: '저는 그냥 학생일 뿐이에요.', romanization: 'jeoneun geunyang hagsaeng-il ppun-ieyo.', vietnamese: 'Tôi chỉ là một học sinh thôi.' },
            ],
          },
          {
            pattern: 'V + -는 법이다',
            meaning: 'Đương nhiên là / Đó là quy luật',
            explanation: 'Diễn tả một sự thật hiển nhiên, một quy luật chung. Tương tự `~기 마련이다`.',
            conjugation: 'Gốc V + `~는 법이다`.',
            examples: [
              { korean: '죄를 지으면 벌을 받는 법이다.', romanization: 'joeleul jieumyeon beol-eul badneun beob-ida.', vietnamese: 'Phạm tội thì đương nhiên là bị trừng phạt.' },
            ],
          },
           {
            pattern: 'V + -(으)ㄹ 만하다',
            meaning: 'Đáng để...',
            explanation: 'Diễn tả một hành động nào đó có giá trị hoặc đáng để thử.',
            conjugation: '- Gốc V có patchim -> `~을 만하다`.\n- Gốc V không có patchim hoặc có patchim ㄹ -> `~ㄹ 만하다`.',
            examples: [
              { korean: '이 책은 한번 읽을 만해요.', romanization: 'i chaeg-eun hanbeon ilg-eul manhaeyo.', vietnamese: 'Quyển sách này đáng để đọc một lần.' },
            ],
          },
          {
            pattern: 'V + -기 나름이다',
            meaning: 'Tuỳ thuộc vào cách làm...',
            explanation: 'Diễn tả kết quả phụ thuộc vào hành động hoặc cách thức thực hiện.',
            conjugation: 'Gốc V + `~기 나름이다`.',
            examples: [
              { korean: '행복은 생각하기 나름이다.', romanization: 'haengbog-eun saeng-gaghagi naleum-ida.', vietnamese: 'Hạnh phúc hay không là do cách suy nghĩ.'},
            ],
          },
          {
            pattern: 'V + -는 둥 마는 둥 하다',
            meaning: 'Làm qua loa/Nửa vời',
            explanation: 'Diễn tả một hành động được làm không đến nơi đến chốn, làm cho có.',
            conjugation: 'Gốc V + `~는 둥 마는 둥 하다`.',
            examples: [
              { korean: '너무 피곤해서 아침을 먹는 둥 마는 둥 하고 출근했어요.', romanization: 'neomu pigonhaeseo achim-eul meogneun dung maneun dung hago chulgeunhaess-eoyo.', vietnamese: 'Vì quá mệt nên tôi đã ăn sáng qua loa rồi đi làm.'},
            ],
          },
          {
            pattern: 'V + -기만 하다',
            meaning: 'Chỉ toàn là...',
            explanation: 'Diễn tả việc chỉ làm một hành động duy nhất, không làm gì khác.',
            conjugation: 'Gốc V + `~기만 하다`.',
            examples: [
              { korean: '아이가 하루 종일 울기만 했어요.', romanization: 'aiga halu jong-il ulgiman haess-eoyo.', vietnamese: 'Đứa trẻ chỉ toàn khóc suốt cả ngày.'},
            ],
          },
          {
            pattern: 'V + -기 십상이다',
            meaning: 'Dễ là/Có khả năng là...',
            explanation: 'Dùng để dự đoán một kết quả xấu có khả năng cao sẽ xảy ra.',
            conjugation: 'Gốc V + `~기 십상이다`.',
            examples: [
              { korean: '그렇게 서두르면 실수하기 십상이다.', romanization: 'geuleohge seoduleumyeon silsuhagi sibsang-ida.', vietnamese: 'Nếu cứ vội vàng như vậy thì dễ mắc lỗi lắm.'},
            ],
          },
           {
            pattern: 'V/A + -(으)ㅁ으로써',
            meaning: 'Bằng cách/Thông qua...',
            explanation: 'Diễn tả phương tiện hoặc cách thức để đạt được một kết quả nào đó.',
            conjugation: 'Gốc V/A + `-(으)ㅁ으로써`.',
            examples: [
              { korean: '열심히 공부함으로써 시험에 합격할 수 있었습니다.', romanization: 'yeolsimhi gongbuhambulosseo siheom-e habgyeoghal su iss-eossseubnida.', vietnamese: 'Bằng cách học chăm chỉ, tôi đã có thể đỗ kỳ thi.'},
            ],
          },
           {
            pattern: 'V/A + -는 한',
            meaning: 'Chừng nào mà/Miễn là...',
            explanation: 'Diễn tả điều kiện mà nếu nó được duy trì thì mệnh đề sau sẽ đúng.',
            conjugation: 'Động từ: `~는 한`. Tính từ: `-(으)ㄴ 한`.',
            examples: [
              { korean: '제가 여기 있는 한 걱정하지 마세요.', romanization: 'jega yeogi issneun han geogjeonghaji maseyo.', vietnamese: 'Miễn là tôi còn ở đây, bạn đừng lo lắng.' },
            ],
          },
           {
            pattern: 'V + -는 김에',
            meaning: 'Nhân tiện...',
            explanation: 'Diễn tả việc thực hiện hành động thứ hai nhân cơ hội hoặc tiện thể làm hành động thứ nhất.',
            conjugation: 'Gốc V + `~는 김에`.',
            examples: [
              { korean: '서점에 가는 김에 제 책도 한 권 사다 주세요.', romanization: 'seojeom-e ganeun gim-e je chaegdo han gwon sada juseyo.', vietnamese: 'Nhân tiện bạn đi nhà sách, mua giúp tôi một quyển sách luôn nhé.' },
            ],
          },
          {
            pattern: 'V + -기로 하다',
            meaning: 'Quyết định',
            explanation: 'Diễn tả một quyết định hoặc kế hoạch đã được đưa ra.',
            conjugation: 'Gốc V + `~기로 하다`.',
            examples: [
              { korean: '우리는 내년에 결혼하기로 했어요.', romanization: 'ulineun naenyeon-e gyeolhonhagilo haess-eoyo.', vietnamese: 'Chúng tôi đã quyết định kết hôn vào năm sau.' },
            ],
          }
        ]
      },
    ]
  },
  {
    levelName: 'Cao cấp',
    levelId: 'advanced',
    categories: [
      {
        categoryName: 'Liên từ & Mệnh đề phụ (Nâng cao)',
        points: [
          {
            pattern: 'V/A + ~(으)므로',
            meaning: 'Vì... nên... (trang trọng)',
            explanation: 'Dùng để chỉ nguyên nhân-kết quả trong văn viết, văn bản chính thức hoặc phát biểu trang trọng. Tương tự `~기 때문에`.',
            conjugation: '- Gốc V/A có patchim -> `~으므로`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~므로`.',
            examples: [
              { korean: '본 제품은 할인 상품이므로 교환 및 환불이 불가합니다.', romanization: 'Bon jepum-eun harin sangpum-im므로 gyohwan mit hwanbur-i bulgahamnida.', vietnamese: 'Vì sản phẩm này là hàng giảm giá nên không thể đổi trả hoặc hoàn tiền.' },
            ],
          },
          {
            pattern: 'V + ~는 나머지',
            meaning: 'Vì quá... đến nỗi...',
            explanation: 'Diễn tả một hành động hoặc cảm xúc ở mức độ quá mức, dẫn đến một kết quả (thường là tiêu cực) ở mệnh đề sau.',
            conjugation: 'Gốc V + `~는 나머지`. Thường dùng với các động từ chỉ cảm xúc.',
            examples: [
              { korean: '그는 너무 놀란 나머지 아무 말도 못 했다.', romanization: 'Geuneun neomu nollan nam-eoji amu maldo mot haetda.', vietnamese: 'Anh ấy vì quá ngạc nhiên đến nỗi đã không thể nói được lời nào.' },
            ],
          },
          {
            pattern: 'V/A + ~거니와',
            meaning: 'Không những... mà còn...',
            explanation: 'Một cách nối câu trang trọng, mang tính văn viết để bổ sung thông tin. Tương tự `~(으)ㄹ 뿐만 아니라`.',
            conjugation: 'Gốc V/A + `~거니와`.',
            examples: [
              { korean: '그녀는 얼굴도 예쁘거니와 마음씨도 곱다.', romanization: 'Geunyeoneun eolguldo yeppeugeoniwa maeumssido gopda.', vietnamese: 'Cô ấy không những xinh đẹp mà còn có tấm lòng nhân hậu.' },
            ],
          },
          {
            pattern: 'V + ~노라면',
            meaning: 'Nếu cứ tiếp tục làm gì đó thì...',
            explanation: 'Diễn tả một giả định rằng nếu một hành động nào đó tiếp diễn trong một khoảng thời gian, thì một kết quả nào đó sẽ xảy ra.',
            conjugation: 'Gốc V + `~노라면`.',
            examples: [
              { korean: '이렇게 계속 노력하노라면 언젠가는 성공할 것이다.', romanization: 'Ireoke gyesok noryeokhanoramyeon eonjenganeun seong-gonghal geosida.', vietnamese: 'Nếu cứ tiếp tục nỗ lực như thế này thì một ngày nào đó sẽ thành công.' },
            ],
          },
          {
            pattern: 'V/A + ~건만',
            meaning: '...thế mà / ...vậy mà',
            explanation: 'Dùng để diễn tả sự tương phản giữa hai mệnh đề, thường mang sắc thái bất ngờ hoặc tiếc nuối.',
            conjugation: 'Gốc V/A + `~건만`.',
            examples: [
              { korean: '그렇게 약속을 했건만 그는 나타나지 않았다.', romanization: 'geureoke yagsog-eul haessgeonman geuneun natanaji anh-assda.', vietnamese: 'Đã hứa như vậy thế mà anh ta đã không xuất hiện.' },
            ],
          },
          {
            pattern: 'V + ~다가는',
            meaning: 'Nếu cứ tiếp tục... thì (sẽ có kết quả xấu)',
            explanation: 'Dùng để cảnh báo rằng nếu hành động ở mệnh đề trước tiếp diễn, một kết quả tiêu cực sẽ xảy ra.',
            conjugation: 'Gốc V + `~다가는`.',
            examples: [
              { korean: '그렇게 매일 술만 마셨다가는 건강이 나빠질 거예요.', romanization: 'Geureoke maeil sul-man masyeotdaganeun geon-gang-i nappajil geoyeyo.', vietnamese: 'Nếu cứ ngày nào cũng chỉ uống rượu như thế thì sức khỏe sẽ xấu đi đấy.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ지언정',
            meaning: 'Thà... chứ quyết không...',
            explanation: 'Diễn tả sự lựa chọn mạnh mẽ, thà chấp nhận vế đầu còn hơn làm vế sau.',
            conjugation: '- Gốc V/A có patchim -> `~을지언정`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~ㄹ지언정`.',
            examples: [
              { korean: '굶어 죽을지언정 도둑질은 하지 않겠다.', romanization: 'Gulm-eo jug-euljieonjeong dodukjil-eun haji anhgessda.', vietnamese: 'Thà chết đói chứ quyết không ăn trộm.' },
            ],
          },
          {
            pattern: 'V/A + -고 해서',
            meaning: 'Một trong những lý do là...',
            explanation: 'Dùng để nêu lên một trong nhiều lý do cho một hành động, không phải lý do duy nhất.',
            conjugation: 'Gốc V/A + `~고 해서`.',
            examples: [
              { korean: '날씨도 좋고 해서 공원에 산책하러 갔어요.', romanization: 'nalssido johgo haeseo gong-won-e sanchaeghaleo gasseoyo.', vietnamese: 'Một phần vì thời tiết đẹp nên tôi đã đi dạo ở công viên.' },
            ],
          },
          {
            pattern: 'V/A + ~(으)되',
            meaning: '...nhưng...',
            explanation: 'Công nhận nội dung của mệnh đề trước, nhưng đưa ra một điều kiện hoặc một ý kiến bổ sung/tương phản ở mệnh đề sau. Mang tính trang trọng.',
            conjugation: 'Gốc V/A + `~(으)되`.',
            examples: [
              { korean: '술은 마시되 과음하지는 마십시오.', romanization: 'sul-eun masidoe gwa-eumhajineun masibsio.', vietnamese: 'Uống rượu thì được nhưng xin đừng quá chén.' },
            ],
          },
          {
            pattern: 'V/A + ~기에',
            meaning: 'Vì... nên...',
            explanation: 'Một cách chỉ nguyên nhân mang tính văn viết, trang trọng, tương tự `~기 때문에`.',
            conjugation: 'Gốc V/A + `~기에`.',
            examples: [
              { korean: '그는 성품이 정직하기에 모든 사람에게 신뢰를 받는다.', romanization: 'geuneun seongpum-i jeongjighagie modeun salam-ege sinloeleul badneunda.', vietnamese: 'Vì anh ấy có phẩm chất chính trực nên nhận được sự tin tưởng từ mọi người.' },
            ],
          },
          {
            pattern: 'V + ~거들랑',
            meaning: 'Nếu... thì...',
            explanation: 'Diễn tả một điều kiện, tương tự `-(으)면` nhưng mang tính nhấn mạnh hơn, thường dùng trong văn nói hoặc khi ra chỉ dẫn.',
            conjugation: 'Gốc V + `~거들랑`.',
            examples: [
              { korean: '도움이 필요하거들랑 언제든지 연락하세요.', romanization: 'doum-i pil-yohageodeullang eonjedeunji yeonlaghaseyo.', vietnamese: 'Nếu cần giúp đỡ thì hãy liên lạc bất cứ lúc nào nhé.' },
            ],
          },
        ]
      },
      {
        categoryName: 'Phỏng đoán & Giả định (Nâng cao)',
        points: [
           {
            pattern: 'V/A + ~(으)ㄹ 테니(까)',
            meaning: 'Chắc là sẽ... nên là...',
            explanation: 'Diễn tả sự phỏng đoán chắc chắn của người nói về một tình huống (vế 1) và đưa ra một đề nghị hoặc mệnh lệnh ở vế 2.',
            conjugation: '- Gốc V/A có patchim -> `~을 테니까`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~ㄹ 테니까`.',
            examples: [
              { korean: '밖에 비가 올 테니까 우산을 가지고 가세요.', romanization: 'Bakk-e biga ol tenikka usan-eul gajigo gaseyo.', vietnamese: 'Chắc là ngoài trời sẽ mưa đấy, nên hãy mang ô đi.' },
            ],
          },
          {
            pattern: 'V/A + ~(으)ㄴ/는가 하면',
            meaning: 'Mặt khác/Đồng thời...',
            explanation: 'Dùng để giới thiệu một sự thật hoặc khả năng, sau đó đưa ra một sự thật hoặc khả năng khác đối lập hoặc bổ sung.',
            conjugation: '- Tính từ / Động từ quá khứ: `-(으)ㄴ가 하면`.\n- Động từ hiện tại: `-는가 하면`.',
            examples: [
              { korean: '노래를 잘하는 사람이 있는가 하면 춤을 잘 추는 사람도 있다.', romanization: 'Noraereul jalhaneun saram-i issneun-ga hamyeon chum-eul jal chuneun saramdo issda.', vietnamese: 'Có người hát hay, mặt khác cũng có người nhảy giỏi.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ 따름이다',
            meaning: 'Chỉ là... mà thôi',
            explanation: 'Nhấn mạnh rằng đó là hành động hoặc trạng thái duy nhất, không có gì hơn. Trang trọng hơn `-(으)ㄹ 뿐이다`.',
            conjugation: '- Gốc V/A có patchim -> `~을 따름이다`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~ㄹ 따름이다`.',
            examples: [
              { korean: '저는 그저 제 할 일을 했을 따름입니다.', romanization: 'Jeoneun geujeo je hal il-eul haesseul ttareum-imnida.', vietnamese: 'Tôi chỉ là đã làm việc phải làm của mình mà thôi.' },
            ],
          },
           {
            pattern: 'V/A + -(으)ㄹ 게 뻔하다',
            meaning: 'Rõ ràng là sẽ... / Chắc chắn là...',
            explanation: 'Diễn tả một phỏng đoán rất chắc chắn về một kết quả tiêu cực trong tương lai.',
            conjugation: 'Gốc V/A + `~(으)ㄹ 게 뻔하다`.',
            examples: [
              { korean: '지금 출발 안 하면 늦을 게 뻔해요.', romanization: 'jigeum chulbal an hamyeon neuj-eul ge ppeonhaeyo.', vietnamese: 'Nếu bây giờ không xuất phát thì rõ ràng là sẽ muộn.' },
            ],
          },
           {
            pattern: 'V/A + -(으)ㄹ진대',
            meaning: 'Nếu đã... thì huống chi...',
            explanation: 'Dùng để đưa ra một tiền đề đã được công nhận, sau đó suy ra một kết luận ở vế sau. Mang tính văn viết, trang trọng.',
            conjugation: 'Gốc V/A + `-(으)ㄹ진대`.',
            examples: [
              { korean: '최선을 다했을진대 좋은 결과가 있을 것이다.', romanization: 'choeseon-eul dahaess-euljindae joh-eun gyeolgwaga iss-eul geos-ida.', vietnamese: 'Nếu đã cố gắng hết sức thì huống chi lại không có kết quả tốt.'},
            ],
          },
          {
            pattern: 'V/A + -(으)ㄹ 성싶다',
            meaning: 'Hình như / Có vẻ...',
            explanation: 'Một cách diễn đạt phỏng đoán mang tính văn viết hoặc hơi cổ, tương tự `~(으)ㄹ 것 같다`.',
            conjugation: '- Gốc V/A có patchim -> `~을 성싶다`.\n- Gốc V/A không có patchim hoặc có patchim ㄹ -> `~ㄹ 성싶다`.',
            examples: [
              { korean: '비가 올 성싶으니 빨리 집에 가자.', romanization: 'Biga ol seongsip-euni ppalli jib-e gaja.', vietnamese: 'Có vẻ trời sắp mưa rồi, chúng ta mau về nhà thôi.' },
            ],
          },
          {
            pattern: 'V + -(으)려니',
            meaning: 'Cứ ngỡ là/Cứ tưởng là...',
            explanation: 'Diễn tả một suy đoán hoặc giả định của người nói, nhưng sau đó một sự thật khác đã xảy ra.',
            conjugation: '- Gốc V có patchim -> `~으려니`.\n- Gốc V không có patchim hoặc có patchim ㄹ -> `~려니`.',
            examples: [
              { korean: '비가 오려니 하고 우산을 챙겼는데 날씨만 좋았다.', romanization: 'biga olyeoni hago usan-eul chaeng-gyeossneunde nalssiman joh-assda.', vietnamese: 'Tôi cứ tưởng là trời sẽ mưa nên đã chuẩn bị ô, nhưng thời tiết lại đẹp.' },
            ],
          },
          {
            pattern: 'V + -자니',
            meaning: 'Định làm... thì lại thấy...',
            explanation: 'Diễn tả sự phân vân, khi định làm hành động V thì lại nhận thấy một vấn đề hoặc tình huống khác.',
            conjugation: 'Gốc V + `-자니`.',
            examples: [
              { korean: '가자니 비가 오고 안 가자니 약속을 어기는 것이고... 어떡하죠?', romanization: 'gajani biga ogo an gajani yagsog-eul eogineun geos-igo... eotteoghajyo?', vietnamese: 'Định đi thì trời lại mưa, mà không đi thì lại thất hứa... làm thế nào bây giờ?' },
            ],
          },
        ]
      },
      {
        categoryName: 'Cấu trúc Nhấn mạnh & Thành ngữ',
        points: [
          {
            pattern: 'A + -기 짝이 없다',
            meaning: 'Cực kỳ/Vô cùng...',
            explanation: 'Dùng để nhấn mạnh mức độ của một tính từ, thường là cảm xúc tiêu cực.',
            conjugation: 'Gốc A + `~기 짝이 없다`.',
            examples: [
              { korean: '혼자만 떨어지니 섭섭하기 짝이 없었다.', romanization: 'Honjaman tteol-eojini seopseophagi jjag-i eopseossda.', vietnamese: 'Vì chỉ có một mình tôi bị rớt nên đã buồn vô cùng.' },
            ],
          },
          {
            pattern: 'V + ~(으)나 마나',
            meaning: '...cũng như không / ...chẳng để làm gì',
            explanation: 'Diễn tả rằng việc thực hiện một hành động nào đó là vô ích, không làm thay đổi kết quả.',
            conjugation: '- Gốc V có patchim -> `~으나 마나`.\n- Gốc V không có patchim -> `~나 마나`.',
            examples: [
              { korean: '지금 가나 마나 기차는 이미 떠났을 거야.', romanization: 'Jigeum gana mana gichaneun imi tteonasseul geoya.', vietnamese: 'Bây giờ có đi cũng như không, tàu chắc đã đi mất rồi.' },
            ],
          },
          {
            pattern: 'A + ~기 그지없다',
            meaning: 'Vô cùng / Hết sức...',
            explanation: 'Một cách nhấn mạnh mức độ của tính từ, tương tự `기 짝이 없다` nhưng có thể dùng cho cả cảm xúc tích cực và tiêu cực.',
            conjugation: 'Gốc A + `~기 그지없다`.',
            examples: [
              { korean: '오랜만에 고향에 오니 기쁘기 그지없다.', romanization: 'Oraenman-e gohyang-e oni gippeugi geujieopda.', vietnamese: 'Lâu rồi mới về quê nên tôi vui mừng khôn xiết.' },
            ],
          },
          {
            pattern: 'V + ~기에 망정이지',
            meaning: 'May mà... chứ không thì...',
            explanation: 'Diễn tả sự may mắn vì đã làm hành động ở vế trước, nếu không thì một kết quả xấu đã xảy ra.',
            conjugation: 'Gốc V + `~기에 망정이지`.',
            examples: [
              { korean: '우산을 가져왔기에 망정이지 큰일 날 뻔했어요.', romanization: 'Usan-eul gajyeo-wassgie mangjeong-iji keun-il nal ppeonhaesseoyo.', vietnamese: 'May mà đã mang ô, chứ không thì to chuyện rồi.' },
            ],
          },
           {
            pattern: 'V + ~기 일쑤이다',
            meaning: 'Thường xuyên (làm điều tiêu cực)',
            explanation: 'Diễn tả một hành động hoặc thói quen xấu thường xuyên xảy ra.',
            conjugation: 'Gốc V + `~기 일쑤이다`.',
            examples: [
              { korean: '그는 약속 시간에 늦기 일쑤이다.', romanization: 'geuneun yagsog sigan-e neujgi ilssu-ida.', vietnamese: 'Anh ta thường xuyên trễ hẹn.' },
            ],
          },
           {
            pattern: 'V + -(으)ㄹ 지경이다',
            meaning: 'Đến mức sắp...',
            explanation: 'Nhấn mạnh một trạng thái cực đoan, đến mức gần như xảy ra một việc gì đó.',
            conjugation: 'Gốc V + `-(으)ㄹ 지경이다`.',
            examples: [
              { korean: '너무 배가 고파서 쓰러질 지경이에요.', romanization: 'neomu baega gopaseo sseuleojil jigyeong-ieyo.', vietnamese: 'Tôi đói đến mức sắp ngất đi được.' },
            ],
          },
           {
            pattern: 'N + 은/는 물론이고',
            meaning: '...là đương nhiên, mà còn...',
            explanation: 'Dùng để nhấn mạnh một điều hiển nhiên, sau đó bổ sung thêm một thông tin khác. Tương tự `~(으)ㄹ 뿐만 아니라`.',
            conjugation: 'N + `~은/는 물론이고`.',
            examples: [
              { korean: '그는 한국어는 물론이고 영어도 잘해요.', romanization: 'geuneun hangug-eoneun mullon-igo yeong-eodo jalhaeyo.', vietnamese: 'Anh ấy tiếng Hàn thì khỏi phải nói, mà cả tiếng Anh cũng giỏi.' },
            ],
          },
          {
            pattern: 'V/A + -거늘',
            meaning: 'Nếu đã... thì hà cớ gì...',
            explanation: 'Nêu ra một sự thật hiển nhiên ở vế trước để làm tiền đề cho một câu hỏi tu từ hoặc một kết luận ở vế sau. Mang tính văn viết/cổ.',
            conjugation: 'Gốc V/A + `-거늘`.',
            examples: [
              { korean: '시간이 금이거늘 어찌 헛되이 보내겠는가?', romanization: 'sigan-i geum-igeoneul eojji heosdoei bonaegessneunga?', vietnamese: 'Thời gian là vàng, hà cớ gì lại lãng phí vô ích?' },
            ],
          },
           {
            pattern: 'V/A + -(으)랴',
            meaning: '...hay sao? / ...được ư?',
            explanation: 'Một đuôi câu hỏi tu từ dùng trong văn viết, thể hiện sự hoài nghi hoặc nhấn mạnh điều ngược lại.',
            conjugation: 'Gốc V/A + `-(으)랴`.',
            examples: [
              { korean: '제 아무리 부자라도 건강을 잃고서야 행복하랴?', romanization: 'je amuli bujalado geongang-eul ilhgoseoya haengboghalyā?', vietnamese: 'Dù giàu có đến mấy mà mất đi sức khoẻ thì hạnh phúc được ư?' },
            ],
          },
          {
            pattern: 'V + -고도',
            meaning: 'Dù đã... nhưng vẫn...',
            explanation: 'Diễn tả một kết quả bất ngờ hoặc trái với mong đợi sau khi một hành động đã xảy ra.',
            conjugation: 'Gốc V + `~고도`.',
            examples: [
              { korean: '그는 약을 먹고도 열이 내리지 않았다.', romanization: 'geuneun yag-eul meog-godo yeol-i naeliji anh-assda.', vietnamese: 'Anh ấy dù đã uống thuốc nhưng vẫn không hạ sốt.' },
            ],
          },
          {
            pattern: 'V + -느니 차라리',
            meaning: 'Thà... còn hơn là...',
            explanation: 'Dùng để so sánh hai lựa chọn và chọn vế sau là lựa chọn tốt hơn (dù cả hai đều không tốt).',
            conjugation: 'Gốc V + `~느니 차라리`.',
            examples: [
              { korean: '이렇게 기다리느니 차라리 집에 가겠다.', romanization: 'ileohge gidalineuni chalali jib-e gagessda.', vietnamese: 'Thà về nhà còn hơn là đợi như thế này.' },
            ],
          },
          {
            pattern: 'V/A + -(으)ㄴ들',
            meaning: 'Dù có... đi nữa thì cũng...',
            explanation: 'Một cấu trúc nhượng bộ mang tính văn viết, thể hiện rằng dù cho điều kiện ở vế trước có xảy ra thì cũng không ảnh hưởng đến kết quả ở vế sau.',
            conjugation: 'Gốc V/A + `-(으)ㄴ들`.',
            examples: [
              { korean: '아무리 돈이 많은들 건강을 잃으면 무슨 소용이 있겠는가?', romanization: 'amuli don-i manh-eundeul geongang-eul ilh-eumyeon museun soyong-i issgessneunga?', vietnamese: 'Dù có nhiều tiền đi nữa mà mất đi sức khỏe thì có ích gì chứ?' },
            ],
          }
        ]
      },
    ]
  }
];