import type { HangeulCharGroup } from '../types';

export const hangeulData: HangeulCharGroup[] = [
  {
    title: 'Phụ âm cơ bản',
    chars: [
      {
        char: 'ㄱ',
        name: 'Giyeok',
        romanization: 'g/k',
        strokes: [
          [{ x: 40, y: 60 }, { x: 160, y: 60 }, { x: 120, y: 150 }]
        ],
        checkpoints: [
          [
            { x: 40, y: 60, radius: 20 },
            { x: 100, y: 60, radius: 20 },
            { x: 160, y: 60, radius: 20 },
            { x: 140, y: 105, radius: 20 },
            { x: 120, y: 150, radius: 20 }
          ]
        ],
        pronunciationTip: 'Phát âm là /g/ khi đứng đầu âm tiết, và /k/ khi đứng cuối.',
        writingRule: 'Một nét duy nhất. Bắt đầu từ trái sang phải, sau đó kéo chéo xuống dưới.',
        examples: [
          { word: '가구', romanization: 'gagu', meaning: 'đồ nội thất' },
          { word: '기억', romanization: 'gieok', meaning: 'ký ức' },
        ],
      },
      {
        char: 'ㄴ',
        name: 'Nieun',
        romanization: 'n',
        strokes: [
          [{ x: 60, y: 40 }, { x: 60, y: 160 }, { x: 160, y: 160 }]
        ],
        checkpoints: [
          [
            { x: 60, y: 40, radius: 20 },
            { x: 60, y: 100, radius: 20 },
            { x: 60, y: 160, radius: 20 },
            { x: 110, y: 160, radius: 20 },
            { x: 160, y: 160, radius: 20 }
          ]
        ],
        pronunciationTip: 'Luôn phát âm là /n/.',
        writingRule: 'Một nét duy nhất. Bắt đầu từ trên xuống dưới, sau đó kéo sang phải.',
        examples: [
          { word: '나라', romanization: 'nara', meaning: 'đất nước' },
          { word: '눈', romanization: 'nun', meaning: 'mắt/tuyết' },
        ],
      },
      {
        char: 'ㄷ',
        name: 'Digeut',
        romanization: 'd/t',
        strokes: [
          [{ x: 40, y: 60 }, { x: 160, y: 60 }],
          [{ x: 40, y: 60 }, { x: 40, y: 150 }, { x: 160, y: 150 }]
        ],
        checkpoints: [
          [
            { x: 40, y: 60, radius: 20 },
            { x: 100, y: 60, radius: 20 },
            { x: 160, y: 60, radius: 20 }
          ],
          [
            { x: 40, y: 60, radius: 20 },
            { x: 40, y: 105, radius: 20 },
            { x: 40, y: 150, radius: 20 },
            { x: 100, y: 150, radius: 20 },
            { x: 160, y: 150, radius: 20 }
          ]
        ],
        pronunciationTip: 'Phát âm là /d/ khi đứng đầu âm tiết, và /t/ khi đứng cuối.',
        writingRule: 'Hai nét. Nét 1 từ trái sang phải. Nét 2 là một đường hình chữ L, từ trên xuống rồi sang phải.',
        examples: [
          { word: '다리', romanization: 'dari', meaning: 'cái chân/cây cầu' },
          { word: '걷다', romanization: 'geotda', meaning: 'đi bộ' },
        ],
      },
      {
        char: 'ㄹ',
        name: 'Rieul',
        romanization: 'r/l',
        strokes: [
          [{ x: 40, y: 40 }, { x: 160, y: 40 }, { x: 160, y: 100 }, { x: 40, y: 100 }, { x: 40, y: 160 }, { x: 160, y: 160 }]
        ],
        checkpoints: [
            [
                { x: 40, y: 40, radius: 20 },
                { x: 100, y: 40, radius: 20 },
                { x: 160, y: 40, radius: 20 },
                { x: 160, y: 70, radius: 20 },
                { x: 160, y: 100, radius: 20 },
                { x: 100, y: 100, radius: 20 },
                { x: 40, y: 100, radius: 20 },
                { x: 40, y: 130, radius: 20 },
                { x: 40, y: 160, radius: 20 },
                { x: 100, y: 160, radius: 20 },
                { x: 160, y: 160, radius: 20 }
            ]
        ],
        pronunciationTip: 'Phát âm là /r/ (âm vỗ) giữa hai nguyên âm, và /l/ ở cuối âm tiết hoặc trước phụ âm.',
        writingRule: 'Một nét duy nhất, giống như vẽ số 3 ngược.',
        examples: [
          { word: '라디오', romanization: 'radio', meaning: 'đài radio' },
          { word: '달', romanization: 'dal', meaning: 'mặt trăng' },
        ],
      },
      {
        char: 'ㅁ',
        name: 'Mieum',
        romanization: 'm',
        strokes: [
          [{ x: 40, y: 40 }, { x: 40, y: 160 }],
          [{ x: 40, y: 40 }, { x: 160, y: 40 }, { x: 160, y: 160 }],
          [{ x: 40, y: 160 }, { x: 160, y: 160 }]
        ],
        checkpoints: [
          [
            { x: 40, y: 40, radius: 20 },
            { x: 40, y: 100, radius: 20 },
            { x: 40, y: 160, radius: 20 }
          ],
          [
            { x: 40, y: 40, radius: 20 },
            { x: 100, y: 40, radius: 20 },
            { x: 160, y: 40, radius: 20 },
            { x: 160, y: 100, radius: 20 },
            { x: 160, y: 160, radius: 20 }
          ],
          [
            { x: 40, y: 160, radius: 20 },
            { x: 100, y: 160, radius: 20 },
            { x: 160, y: 160, radius: 20 }
          ]
        ],
        pronunciationTip: 'Luôn phát âm là /m/.',
        writingRule: 'Ba nét, vẽ một hình vuông. Bắt đầu với nét dọc bên trái, sau đó là nét trên và phải, cuối cùng là nét đáy.',
        examples: [
          { word: '마음', romanization: 'maeum', meaning: 'trái tim/tấm lòng' },
          { word: '엄마', romanization: 'eomma', meaning: 'mẹ' },
        ],
      },
      {
        char: 'ㅂ',
        name: 'Bieup',
        romanization: 'b/p',
        strokes: [
          [{ x: 60, y: 40 }, { x: 60, y: 160 }],
          [{ x: 140, y: 40 }, { x: 140, y: 160 }],
          [{ x: 60, y: 90 }, { x: 140, y: 90 }],
          [{ x: 60, y: 160 }, { x: 140, y: 160 }]
        ],
        checkpoints: [
          [
            { x: 60, y: 40, radius: 20 },
            { x: 60, y: 100, radius: 20 },
            { x: 60, y: 160, radius: 20 }
          ],
          [
            { x: 140, y: 40, radius: 20 },
            { x: 140, y: 100, radius: 20 },
            { x: 140, y: 160, radius: 20 }
          ],
          [
            { x: 60, y: 90, radius: 20 },
            { x: 100, y: 90, radius: 20 },
            { x: 140, y: 90, radius: 20 }
          ],
          [
            { x: 60, y: 160, radius: 20 },
            { x: 100, y: 160, radius: 20 },
            { x: 140, y: 160, radius: 20 }
          ]
        ],
        pronunciationTip: 'Phát âm là /b/ khi đứng đầu âm tiết, và /p/ khi đứng cuối.',
        writingRule: 'Bốn nét. Hai nét dọc song song, sau đó là hai nét ngang ngắn hơn ở giữa.',
        examples: [
          { word: '바람', romanization: 'baram', meaning: 'gió' },
          { word: '밥', romanization: 'bap', meaning: 'cơm' },
        ],
      },
      {
        char: 'ㅅ',
        name: 'Siot',
        romanization: 's/t',
        strokes: [
          [{ x: 100, y: 40 }, { x: 60, y: 160 }],
          [{ x: 100, y: 40 }, { x: 140, y: 160 }]
        ],
        checkpoints: [
          [
            { x: 100, y: 40, radius: 20 },
            { x: 80, y: 100, radius: 20 },
            { x: 60, y: 160, radius: 20 }
          ],
          [
            { x: 100, y: 40, radius: 20 },
            { x: 120, y: 100, radius: 20 },
            { x: 140, y: 160, radius: 20 }
          ]
        ],
        pronunciationTip: 'Phát âm là /s/ trước nguyên âm, nhưng sẽ bị biến âm trước /i/ thành /sh/. Ở cuối âm tiết, phát âm là /t/.',
        writingRule: 'Hai nét chéo, giống như một mái nhà, bắt đầu từ trên đỉnh.',
        examples: [
          { word: '사람', romanization: 'saram', meaning: 'người' },
          { word: '옷', romanization: 'ot', meaning: 'quần áo' },
        ],
      },
      {
        char: 'ㅇ',
        name: 'Ieung',
        romanization: '(âm câm)/ng',
        strokes: [
          [{ x: 100, y: 40 }, { x: 160, y: 100 }, { x: 100, y: 160 }, { x: 40, y: 100 }, { x: 100, y: 40 }]
        ],
        checkpoints: [
            [
                { x: 100, y: 40, radius: 20 },
                { x: 150, y: 60, radius: 20 },
                { x: 160, y: 100, radius: 20 },
                { x: 150, y: 140, radius: 20 },
                { x: 100, y: 160, radius: 20 },
                { x: 50, y: 140, radius: 20 },
                { x: 40, y: 100, radius: 20 },
                { x: 50, y: 60, radius: 20 }
            ]
        ],
        pronunciationTip: 'Là âm câm khi đứng đầu một âm tiết (làm phụ âm đầu cho nguyên âm). Phát âm là /ng/ khi đứng ở cuối âm tiết.',
        writingRule: 'Một nét duy nhất, vẽ một vòng tròn ngược chiều kim đồng hồ.',
        examples: [
          { word: '아이', romanization: 'ai', meaning: 'đứa trẻ' },
          { word: '사랑', romanization: 'sarang', meaning: 'tình yêu' },
        ],
      },
      {
        char: 'ㅈ',
        name: 'Jieut',
        romanization: 'j/t',
        strokes: [
          [{ x: 40, y: 60 }, { x: 160, y: 60 }],
          [{ x: 100, y: 60 }, { x: 60, y: 160 }],
          [{ x: 100, y: 60 }, { x: 140, y: 160 }]
        ],
        checkpoints: [
          [
            { x: 40, y: 60, radius: 20 },
            { x: 100, y: 60, radius: 20 },
            { x: 160, y: 60, radius: 20 }
          ],
          [
            { x: 100, y: 60, radius: 20 },
            { x: 80, y: 110, radius: 20 },
            { x: 60, y: 160, radius: 20 }
          ],
          [
            { x: 100, y: 60, radius: 20 },
            { x: 120, y: 110, radius: 20 },
            { x: 140, y: 160, radius: 20 }
          ]
        ],
        pronunciationTip: 'Phát âm là /j/ (giống "ch" trong "cha" của tiếng Việt) khi đứng đầu âm tiết, và /t/ khi đứng cuối.',
        writingRule: 'Hai hoặc ba nét. Bắt đầu với nét ngang ngắn. Sau đó là hai nét chéo như chữ ㅅ bên dưới.',
        examples: [
          { word: '자다', romanization: 'jada', meaning: 'ngủ' },
          { word: '낮', romanization: 'nat', meaning: 'ban ngày' },
        ],
      },
       {
        char: 'ㅊ',
        name: 'Chieut',
        romanization: 'ch/t',
        strokes: [
            [{ x: 80, y: 40 }, { x: 120, y: 40 }],
            [{ x: 40, y: 80 }, { x: 160, y: 80 }],
            [{ x: 100, y: 80 }, { x: 60, y: 160 }],
            [{ x: 100, y: 80 }, { x: 140, y: 160 }]
        ],
        checkpoints: [
            [{ x: 80, y: 40, radius: 15 }, { x: 120, y: 40, radius: 15 }],
            [{ x: 40, y: 80, radius: 20 }, { x: 100, y: 80, radius: 20 }, { x: 160, y: 80, radius: 20 }],
            [{ x: 100, y: 80, radius: 20 }, { x: 80, y: 120, radius: 20 }, { x: 60, y: 160, radius: 20 }],
            [{ x: 100, y: 80, radius: 20 }, { x: 120, y: 120, radius: 20 }, { x: 140, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Là phiên bản bật hơi của ㅈ, phát âm là /ch/ (giống "ch" trong "chim" nhưng mạnh hơn, có luồng hơi bật ra). Cuối âm tiết phát âm là /t/.',
        writingRule: 'Thêm một nét ngang ngắn trên đầu chữ ㅈ.',
        examples: [
            { word: '차', romanization: 'cha', meaning: 'xe/trà' },
            { word: '친구', romanization: 'chingu', meaning: 'bạn bè' },
        ]
    },
      {
        char: 'ㅋ',
        name: 'Kieuk',
        romanization: 'k',
        strokes: [
          [{ x: 40, y: 60 }, { x: 160, y: 60 }, { x: 120, y: 150 }],
          [{ x: 60, y: 95 }, { x: 140, y: 95 }]
        ],
        checkpoints: [
            [
                { x: 40, y: 60, radius: 20 },
                { x: 100, y: 60, radius: 20 },
                { x: 160, y: 60, radius: 20 },
                { x: 140, y: 105, radius: 20 },
                { x: 120, y: 150, radius: 20 }
            ],
            [{ x: 60, y: 95, radius: 20 }, { x: 100, y: 95, radius: 20 }, { x: 140, y: 95, radius: 20 }]
        ],
        pronunciationTip: 'Là phiên bản bật hơi của ㄱ. Phát âm là /k/ mạnh, có luồng hơi bật ra.',
        writingRule: 'Thêm một nét ngang vào giữa chữ ㄱ.',
        examples: [
            { word: '카메라', romanization: 'kamera', meaning: 'máy ảnh' },
            { word: '크다', romanization: 'keuda', meaning: 'to, lớn' },
        ]
    },
    {
        char: 'ㅌ',
        name: 'Tieut',
        romanization: 't',
        strokes: [
            [{ x: 40, y: 60 }, { x: 160, y: 60 }],
            [{ x: 60, y: 100 }, { x: 140, y: 100 }],
            [{ x: 40, y: 60 }, { x: 40, y: 140 }, { x: 160, y: 140 }]
        ],
        checkpoints: [
            [{ x: 40, y: 60, radius: 20 }, { x: 100, y: 60, radius: 20 }, { x: 160, y: 60, radius: 20 }],
            [{ x: 60, y: 100, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 140, y: 100, radius: 20 }],
            [{ x: 40, y: 60, radius: 20 }, { x: 40, y: 100, radius: 20 }, { x: 40, y: 140, radius: 20 }, { x: 100, y: 140, radius: 20 }, { x: 160, y: 140, radius: 20 }]
        ],
        pronunciationTip: 'Là phiên bản bật hơi của ㄷ. Phát âm là /t/ mạnh, có luồng hơi bật ra.',
        writingRule: 'Giống như chữ E viết hoa. Ba nét ngang và một nét dọc.',
        examples: [
            { word: '토마토', romanization: 'tomato', meaning: 'cà chua' },
            { word: '타다', romanization: 'tada', meaning: 'đi (xe), cưỡi' },
        ]
    },
    {
        char: 'ㅍ',
        name: 'Pieup',
        romanization: 'p',
        strokes: [
            [{ x: 40, y: 60 }, { x: 160, y: 60 }],
            [{ x: 70, y: 60 }, { x: 70, y: 140 }],
            [{ x: 130, y: 60 }, { x: 130, y: 140 }],
            [{ x: 40, y: 140 }, { x: 160, y: 140 }]
        ],
        checkpoints: [
            [{ x: 40, y: 60, radius: 20 }, { x: 100, y: 60, radius: 20 }, { x: 160, y: 60, radius: 20 }],
            [{ x: 70, y: 60, radius: 20 }, { x: 70, y: 100, radius: 20 }, { x: 70, y: 140, radius: 20 }],
            [{ x: 130, y: 60, radius: 20 }, { x: 130, y: 100, radius: 20 }, { x: 130, y: 140, radius: 20 }],
            [{ x: 40, y: 140, radius: 20 }, { x: 100, y: 140, radius: 20 }, { x: 160, y: 140, radius: 20 }]
        ],
        pronunciationTip: 'Là phiên bản bật hơi của ㅂ. Phát âm là /p/ mạnh, có luồng hơi bật ra.',
        writingRule: 'Bốn nét. Giống chữ số II trong la mã. Nét ngang trên, hai nét dọc, nét ngang dưới.',
        examples: [
            { word: '포도', romanization: 'podo', meaning: 'quả nho' },
            { word: '피자', romanization: 'pija', meaning: 'pizza' },
        ]
    },
    {
        char: 'ㅎ',
        name: 'Hieut',
        romanization: 'h/t',
        strokes: [
            [{ x: 80, y: 50 }, { x: 120, y: 50 }],
            [{ x: 80, y: 80 }, { x: 120, y: 80 }],
            [{ x: 100, y: 80 }, { x: 160, y: 140 }, { x: 100, y: 180 }, { x: 40, y: 140 }, { x: 100, y: 80 }]
        ],
        checkpoints: [
            [{ x: 80, y: 50, radius: 20 }, { x: 120, y: 50, radius: 20 }],
            [{ x: 80, y: 80, radius: 20 }, { x: 120, y: 80, radius: 20 }],
            [
                { x: 100, y: 80, radius: 20 }, 
                { x: 140, y: 120, radius: 20 }, 
                { x: 160, y: 140, radius: 20 },
                { x: 130, y: 160, radius: 20 },
                { x: 100, y: 180, radius: 20 },
                { x: 70, y: 160, radius: 20 },
                { x: 40, y: 140, radius: 20 },
                { x: 60, y: 120, radius: 20 }
            ]
        ],
        pronunciationTip: 'Phát âm là /h/ khi đứng đầu âm tiết. Ở cuối âm tiết, phát âm là /t/.',
        writingRule: 'Ba nét. Hai nét ngang ngắn trên đầu, sau đó là một hình tròn bên dưới.',
        examples: [
            { word: '하다', romanization: 'hada', meaning: 'làm' },
            { word: '하늘', romanization: 'haneul', meaning: 'bầu trời' },
        ]
    },
    ],
  },
  {
    title: 'Phụ âm đôi',
    chars: [
       {
        char: 'ㄲ',
        name: 'Ssanggiyeok',
        romanization: 'kk',
        strokes: [
          [{ x: 30, y: 60 }, { x: 100, y: 60 }, { x: 80, y: 140 }],
          [{ x: 110, y: 60 }, { x: 180, y: 60 }, { x: 160, y: 140 }]
        ],
        checkpoints: [
          [
            { x: 30, y: 60, radius: 15 },
            { x: 65, y: 60, radius: 15 },
            { x: 100, y: 60, radius: 15 },
            { x: 90, y: 100, radius: 15 },
            { x: 80, y: 140, radius: 15 }
          ],
          [
            { x: 110, y: 60, radius: 15 },
            { x: 145, y: 60, radius: 15 },
            { x: 180, y: 60, radius: 15 },
            { x: 170, y: 100, radius: 15 },
            { x: 160, y: 140, radius: 15 }
          ]
        ],
        pronunciationTip: 'Âm căng, phát âm là /kk/ (giống "c" trong "căng" của tiếng Việt). Không bật hơi.',
        writingRule: 'Viết hai chữ ㄱ cạnh nhau.',
        examples: [
          { word: '까치', romanization: 'kkachi', meaning: 'chim ác là' },
          { word: '꿈', romanization: 'kkum', meaning: 'giấc mơ' },
        ],
      },
       {
        char: 'ㄸ',
        name: 'Ssangdigeut',
        romanization: 'tt',
        strokes: [
            [{ x: 20, y: 60 }, { x: 90, y: 60 }],
            [{ x: 20, y: 60 }, { x: 20, y: 140 }, { x: 90, y: 140 }],
            [{ x: 110, y: 60 }, { x: 180, y: 60 }],
            [{ x: 110, y: 60 }, { x: 110, y: 140 }, { x: 180, y: 140 }]
        ],
        checkpoints: [
            [{ x: 20, y: 60, radius: 15 }, { x: 55, y: 60, radius: 15 }, { x: 90, y: 60, radius: 15 }],
            [{ x: 20, y: 60, radius: 15 }, { x: 20, y: 100, radius: 15 }, { x: 20, y: 140, radius: 15 }, { x: 55, y: 140, radius: 15 }, { x: 90, y: 140, radius: 15 }],
            [{ x: 110, y: 60, radius: 15 }, { x: 145, y: 60, radius: 15 }, { x: 180, y: 60, radius: 15 }],
            [{ x: 110, y: 60, radius: 15 }, { x: 110, y: 100, radius: 15 }, { x: 110, y: 140, radius: 15 }, { x: 145, y: 140, radius: 15 }, { x: 180, y: 140, radius: 15 }]
        ],
        pronunciationTip: 'Âm căng, phát âm là /tt/ (giống "t" trong "tăng" của tiếng Việt). Không bật hơi.',
        writingRule: 'Viết hai chữ ㄷ cạnh nhau.',
        examples: [
          { word: '딸기', romanization: 'ttalgi', meaning: 'dâu tây' },
          { word: '떠나다', romanization: 'tteonada', meaning: 'rời đi' },
        ],
      },
       {
        char: 'ㅃ',
        name: 'Ssangbieup',
        romanization: 'pp',
        strokes: [
            [{ x: 30, y: 40 }, { x: 30, y: 160 }], [{ x: 70, y: 40 }, { x: 70, y: 160 }],
            [{ x: 30, y: 90 }, { x: 70, y: 90 }], [{ x: 30, y: 160 }, { x: 70, y: 160 }],
            [{ x: 130, y: 40 }, { x: 130, y: 160 }], [{ x: 170, y: 40 }, { x: 170, y: 160 }],
            [{ x: 130, y: 90 }, { x: 170, y: 90 }], [{ x: 130, y: 160 }, { x: 170, y: 160 }]
        ],
        checkpoints: [
            [{ x: 30, y: 40, radius: 15 }, { x: 30, y: 100, radius: 15 }, { x: 30, y: 160, radius: 15 }],
            [{ x: 70, y: 40, radius: 15 }, { x: 70, y: 100, radius: 15 }, { x: 70, y: 160, radius: 15 }],
            [{ x: 30, y: 90, radius: 15 }, { x: 50, y: 90, radius: 15 }, { x: 70, y: 90, radius: 15 }],
            [{ x: 30, y: 160, radius: 15 }, { x: 50, y: 160, radius: 15 }, { x: 70, y: 160, radius: 15 }],
            [{ x: 130, y: 40, radius: 15 }, { x: 130, y: 100, radius: 15 }, { x: 130, y: 160, radius: 15 }],
            [{ x: 170, y: 40, radius: 15 }, { x: 170, y: 100, radius: 15 }, { x: 170, y: 160, radius: 15 }],
            [{ x: 130, y: 90, radius: 15 }, { x: 150, y: 90, radius: 15 }, { x: 170, y: 90, radius: 15 }],
            [{ x: 130, y: 160, radius: 15 }, { x: 150, y: 160, radius: 15 }, { x: 170, y: 160, radius: 15 }]
        ],
        pronunciationTip: 'Âm căng, phát âm là /pp/ (giống "p" trong "păng" của tiếng Việt). Không bật hơi.',
        writingRule: 'Viết hai chữ ㅂ cạnh nhau.',
        examples: [
          { word: '빵', romanization: 'ppang', meaning: 'bánh mì' },
          { word: '아빠', romanization: 'appa', meaning: 'bố' },
        ],
      },
       {
        char: 'ㅆ',
        name: 'Ssangsiot',
        romanization: 'ss',
        strokes: [
            [{ x: 60, y: 40 }, { x: 30, y: 160 }], [{ x: 60, y: 40 }, { x: 90, y: 160 }],
            [{ x: 140, y: 40 }, { x: 110, y: 160 }], [{ x: 140, y: 40 }, { x: 170, y: 160 }]
        ],
        checkpoints: [
            [{ x: 60, y: 40, radius: 15 }, { x: 45, y: 100, radius: 15 }, { x: 30, y: 160, radius: 15 }],
            [{ x: 60, y: 40, radius: 15 }, { x: 75, y: 100, radius: 15 }, { x: 90, y: 160, radius: 15 }],
            [{ x: 140, y: 40, radius: 15 }, { x: 125, y: 100, radius: 15 }, { x: 110, y: 160, radius: 15 }],
            [{ x: 140, y: 40, radius: 15 }, { x: 155, y: 100, radius: 15 }, { x: 170, y: 160, radius: 15 }]
        ],
        pronunciationTip: 'Âm căng, phát âm là /ss/ (giống "s" trong "sắc" của tiếng Việt, nhưng căng và mạnh hơn).',
        writingRule: 'Viết hai chữ ㅅ cạnh nhau.',
        examples: [
          { word: '싸다', romanization: 'ssada', meaning: 'rẻ' },
          { word: '아저씨', romanization: 'ajeossi', meaning: 'chú, bác' },
        ],
      },
       {
        char: 'ㅉ',
        name: 'Ssangjieut',
        romanization: 'jj',
        strokes: [
            [{ x: 20, y: 60 }, { x: 90, y: 60 }],
            [{ x: 55, y: 60 }, { x: 30, y: 140 }],
            [{ x: 55, y: 60 }, { x: 80, y: 140 }],
            [{ x: 110, y: 60 }, { x: 180, y: 60 }],
            [{ x: 145, y: 60 }, { x: 120, y: 140 }],
            [{ x: 145, y: 60 }, { x: 170, y: 140 }]
        ],
        checkpoints: [
            [{ x: 20, y: 60, radius: 15 }, { x: 55, y: 60, radius: 15 }, { x: 90, y: 60, radius: 15 }],
            [{ x: 55, y: 60, radius: 15 }, { x: 42, y: 100, radius: 15 }, { x: 30, y: 140, radius: 15 }],
            [{ x: 55, y: 60, radius: 15 }, { x: 68, y: 100, radius: 15 }, { x: 80, y: 140, radius: 15 }],
            [{ x: 110, y: 60, radius: 15 }, { x: 145, y: 60, radius: 15 }, { x: 180, y: 60, radius: 15 }],
            [{ x: 145, y: 60, radius: 15 }, { x: 132, y: 100, radius: 15 }, { x: 120, y: 140, radius: 15 }],
            [{ x: 145, y: 60, radius: 15 }, { x: 158, y: 100, radius: 15 }, { x: 170, y: 140, radius: 15 }]
        ],
        pronunciationTip: 'Âm căng, phát âm là /jj/ (giống "ch" trong "chắc" của tiếng Việt). Không bật hơi.',
        writingRule: 'Viết hai chữ ㅈ cạnh nhau.',
        examples: [
          { word: '짜다', romanization: 'jjada', meaning: 'mặn' },
          { word: '진짜', romanization: 'jinjja', meaning: 'thật sự' },
        ],
      },
    ],
  },
  {
    title: 'Nguyên âm cơ bản',
    chars: [
       {
        char: 'ㅏ',
        name: 'A',
        romanization: 'a',
        strokes: [
          [{ x: 100, y: 40 }, { x: 100, y: 160 }],
          [{ x: 100, y: 100 }, { x: 140, y: 100 }]
        ],
        checkpoints: [
          [{ x: 100, y: 40, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 100, y: 160, radius: 20 }],
          [{ x: 100, y: 100, radius: 20 }, { x: 120, y: 100, radius: 20 }, { x: 140, y: 100, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /a/, tương tự "a" trong tiếng Việt.',
        writingRule: 'Hai nét. Nét dọc từ trên xuống, sau đó là nét ngang ngắn từ giữa sang phải.',
        examples: [
          { word: '아이', romanization: 'ai', meaning: 'đứa trẻ' },
          { word: '가다', romanization: 'gada', meaning: 'đi' },
        ],
      },
      {
        char: 'ㅑ',
        name: 'Ya',
        romanization: 'ya',
        strokes: [
          [{ x: 100, y: 40 }, { x: 100, y: 160 }],
          [{ x: 100, y: 80 }, { x: 140, y: 80 }],
          [{ x: 100, y: 120 }, { x: 140, y: 120 }]
        ],
        checkpoints: [
          [{ x: 100, y: 40, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 100, y: 160, radius: 20 }],
          [{ x: 100, y: 80, radius: 20 }, { x: 120, y: 80, radius: 20 }, { x: 140, y: 80, radius: 20 }],
          [{ x: 100, y: 120, radius: 20 }, { x: 120, y: 120, radius: 20 }, { x: 140, y: 120, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /ya/, tương tự "da" trong tiếng Việt.',
        writingRule: 'Ba nét. Nét dọc từ trên xuống, sau đó là hai nét ngang ngắn song song.',
        examples: [
          { word: '야구', romanization: 'yagu', meaning: 'bóng chày' },
          { word: '이야기', romanization: 'iyagi', meaning: 'câu chuyện' },
        ],
      },
      {
        char: 'ㅓ',
        name: 'Eo',
        romanization: 'eo',
        strokes: [
          [{ x: 60, y: 100 }, { x: 100, y: 100 }],
          [{ x: 100, y: 40 }, { x: 100, y: 160 }]
        ],
        checkpoints: [
          [{ x: 60, y: 100, radius: 20 }, { x: 80, y: 100, radius: 20 }, { x: 100, y: 100, radius: 20 }],
          [{ x: 100, y: 40, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 100, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /eo/, giống âm "o" trong từ "con" của tiếng Việt, miệng mở rộng hơn.',
        writingRule: 'Hai nét. Nét ngang ngắn từ trái vào giữa, sau đó là nét dọc từ trên xuống.',
        examples: [
          { word: '어머니', romanization: 'eomeoni', meaning: 'mẹ' },
          { word: '서다', romanization: 'seoda', meaning: 'đứng' },
        ],
      },
      {
        char: 'ㅕ',
        name: 'Yeo',
        romanization: 'yeo',
        strokes: [
          [{ x: 60, y: 80 }, { x: 100, y: 80 }],
          [{ x: 60, y: 120 }, { x: 100, y: 120 }],
          [{ x: 100, y: 40 }, { x: 100, y: 160 }]
        ],
        checkpoints: [
          [{ x: 60, y: 80, radius: 20 }, { x: 80, y: 80, radius: 20 }, { x: 100, y: 80, radius: 20 }],
          [{ x: 60, y: 120, radius: 20 }, { x: 80, y: 120, radius: 20 }, { x: 100, y: 120, radius: 20 }],
          [{ x: 100, y: 40, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 100, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /yeo/, giống /eo/ nhưng có âm /y/ ở trước. Tương tự "do" trong tiếng Việt.',
        writingRule: 'Ba nét. Hai nét ngang ngắn song song, sau đó là một nét dọc.',
        examples: [
          { word: '여자', romanization: 'yeoja', meaning: 'con gái' },
          { word: '여행', romanization: 'yeohaeng', meaning: 'du lịch' },
        ],
      },
      {
        char: 'ㅗ',
        name: 'O',
        romanization: 'o',
        strokes: [
          [{ x: 100, y: 60 }, { x: 100, y: 100 }],
          [{ x: 60, y: 100 }, { x: 140, y: 100 }]
        ],
        checkpoints: [
          [{ x: 100, y: 60, radius: 20 }, { x: 100, y: 80, radius: 20 }, { x: 100, y: 100, radius: 20 }],
          [{ x: 60, y: 100, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 140, y: 100, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /o/, tương tự "ô" trong tiếng Việt.',
        writingRule: 'Hai nét. Nét dọc ngắn từ trên xuống, sau đó là nét ngang dài bên dưới.',
        examples: [
          { word: '오이', romanization: 'oi', meaning: 'dưa chuột' },
          { word: '보다', romanization: 'boda', meaning: 'nhìn, xem' },
        ],
      },
      {
        char: 'ㅛ',
        name: 'Yo',
        romanization: 'yo',
        strokes: [
          [{ x: 80, y: 60 }, { x: 80, y: 100 }],
          [{ x: 120, y: 60 }, { x: 120, y: 100 }],
          [{ x: 60, y: 100 }, { x: 140, y: 100 }]
        ],
        checkpoints: [
          [{ x: 80, y: 60, radius: 20 }, { x: 80, y: 80, radius: 20 }, { x: 80, y: 100, radius: 20 }],
          [{ x: 120, y: 60, radius: 20 }, { x: 120, y: 80, radius: 20 }, { x: 120, y: 100, radius: 20 }],
          [{ x: 60, y: 100, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 140, y: 100, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /yo/, tương tự "dô" trong tiếng Việt.',
        writingRule: 'Ba nét. Hai nét dọc ngắn song song, sau đó là một nét ngang dài bên dưới.',
        examples: [
          { word: '요리', romanization: 'yori', meaning: 'nấu ăn' },
          { word: '교사', romanization: 'gyosa', meaning: 'giáo viên' },
        ],
      },
       {
        char: 'ㅜ',
        name: 'U',
        romanization: 'u',
        strokes: [
            [{ x: 60, y: 80 }, { x: 140, y: 80 }],
            [{ x: 100, y: 80 }, { x: 100, y: 120 }]
        ],
        checkpoints: [
            [{ x: 60, y: 80, radius: 20 }, { x: 100, y: 80, radius: 20 }, { x: 140, y: 80, radius: 20 }],
            [{ x: 100, y: 80, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 100, y: 120, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /u/, tương tự "u" trong tiếng Việt.',
        writingRule: 'Hai nét. Nét ngang dài trước, sau đó là nét dọc ngắn từ giữa đi xuống.',
        examples: [
            { word: '우리', romanization: 'uri', meaning: 'chúng tôi' },
            { word: '우유', romanization: 'uyu', meaning: 'sữa' },
        ]
    },
    {
        char: 'ㅠ',
        name: 'Yu',
        romanization: 'yu',
        strokes: [
            [{ x: 60, y: 80 }, { x: 140, y: 80 }],
            [{ x: 80, y: 80 }, { x: 80, y: 120 }],
            [{ x: 120, y: 80 }, { x: 120, y: 120 }]
        ],
        checkpoints: [
            [{ x: 60, y: 80, radius: 20 }, { x: 100, y: 80, radius: 20 }, { x: 140, y: 80, radius: 20 }],
            [{ x: 80, y: 80, radius: 20 }, { x: 80, y: 100, radius: 20 }, { x: 80, y: 120, radius: 20 }],
            [{ x: 120, y: 80, radius: 20 }, { x: 120, y: 100, radius: 20 }, { x: 120, y: 120, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /yu/, tương tự "du" trong tiếng Việt.',
        writingRule: 'Ba nét. Nét ngang dài trước, sau đó là hai nét dọc ngắn song song đi xuống.',
        examples: [
            { word: '유리', romanization: 'yuri', meaning: 'thủy tinh' },
            { word: '휴가', romanization: 'hyuga', meaning: 'kỳ nghỉ' },
        ]
    },
    {
        char: 'ㅡ',
        name: 'Eu',
        romanization: 'eu',
        strokes: [
            [{ x: 40, y: 100 }, { x: 160, y: 100 }]
        ],
        checkpoints: [
            [{ x: 40, y: 100, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 160, y: 100, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /eu/, âm này không có trong tiếng Việt. Giữ miệng ở vị trí phát âm "i", nhưng phát ra âm "ư".',
        writingRule: 'Một nét ngang duy nhất từ trái sang phải.',
        examples: [
            { word: '음식', romanization: 'eumsik', meaning: 'đồ ăn' },
            { word: '슬프다', romanization: 'seulpeuda', meaning: 'buồn' },
        ]
    },
    {
        char: 'ㅣ',
        name: 'I',
        romanization: 'i',
        strokes: [
            [{ x: 100, y: 40 }, { x: 100, y: 160 }]
        ],
        checkpoints: [
            [{ x: 100, y: 40, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 100, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /i/, tương tự "i" trong tiếng Việt.',
        writingRule: 'Một nét dọc duy nhất từ trên xuống dưới.',
        examples: [
            { word: '이름', romanization: 'ireum', meaning: 'tên' },
            { word: '비', romanization: 'bi', meaning: 'mưa' },
        ]
    },
    ],
  },
  {
    title: 'Nguyên âm đôi',
    chars: [
       {
        char: 'ㅐ',
        name: 'Ae',
        romanization: 'ae',
        strokes: [
          [{ x: 80, y: 40 }, { x: 80, y: 160 }],
          [{ x: 80, y: 100 }, { x: 120, y: 100 }],
          [{ x: 120, y: 40 }, { x: 120, y: 160 }]
        ],
        checkpoints: [
          [{ x: 80, y: 40, radius: 20 }, { x: 80, y: 100, radius: 20 }, { x: 80, y: 160, radius: 20 }],
          [{ x: 80, y: 100, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 120, y: 100, radius: 20 }],
          [{ x: 120, y: 40, radius: 20 }, { x: 120, y: 100, radius: 20 }, { x: 120, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /ae/, tương tự "e" trong tiếng Việt nhưng miệng mở rộng hơn, giống "a" và "e" kết hợp.',
        writingRule: 'Kết hợp ㅏ và ㅣ. Viết ㅏ trước, sau đó thêm ㅣ.',
        examples: [
          { word: '개', romanization: 'gae', meaning: 'con chó' },
          { word: '사과', romanization: 'sagwa', meaning: 'quả táo' },
        ],
      },
       {
        char: 'ㅔ',
        name: 'E',
        romanization: 'e',
        strokes: [
            [{ x: 80, y: 100 }, { x: 120, y: 100 }],
            [{ x: 120, y: 40 }, { x: 120, y: 160 }],
            [{ x: 80, y: 40 }, { x: 80, y: 160 }]
        ],
        checkpoints: [
            [{ x: 80, y: 100, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 120, y: 100, radius: 20 }],
            [{ x: 120, y: 40, radius: 20 }, { x: 120, y: 100, radius: 20 }, { x: 120, y: 160, radius: 20 }],
            [{ x: 80, y: 40, radius: 20 }, { x: 80, y: 100, radius: 20 }, { x: 80, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /e/, tương tự "ê" trong tiếng Việt. Hiện nay ㅐ và ㅔ phát âm gần như giống hệt nhau.',
        writingRule: 'Kết hợp ㅓ và ㅣ. Viết ㅓ trước, sau đó thêm ㅣ.',
        examples: [
          { word: '네', romanization: 'ne', meaning: 'vâng/bạn' },
          { word: '세상', romanization: 'sesang', meaning: 'thế giới' },
        ],
      },
      {
        char: 'ㅒ',
        name: 'Yae',
        romanization: 'yae',
        strokes: [
            [{ x: 80, y: 40 }, { x: 80, y: 160 }],
            [{ x: 80, y: 80 }, { x: 120, y: 80 }],
            [{ x: 80, y: 120 }, { x: 120, y: 120 }],
            [{ x: 120, y: 40 }, { x: 120, y: 160 }]
        ],
        checkpoints: [
            [{ x: 80, y: 40, radius: 20 }, { x: 80, y: 100, radius: 20 }, { x: 80, y: 160, radius: 20 }],
            [{ x: 80, y: 80, radius: 20 }, { x: 100, y: 80, radius: 20 }, { x: 120, y: 80, radius: 20 }],
            [{ x: 80, y: 120, radius: 20 }, { x: 100, y: 120, radius: 20 }, { x: 120, y: 120, radius: 20 }],
            [{ x: 120, y: 40, radius: 20 }, { x: 120, y: 100, radius: 20 }, { x: 120, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /yae/. Giống như ㅐ có thêm âm /y/ phía trước.',
        writingRule: 'Kết hợp ㅑ và ㅣ. Viết ㅑ trước, sau đó thêm ㅣ.',
        examples: [
          { word: '얘기', romanization: 'yaegi', meaning: 'câu chuyện' },
        ],
      },
      {
        char: 'ㅖ',
        name: 'Ye',
        romanization: 'ye',
        strokes: [
            [{ x: 80, y: 80 }, { x: 120, y: 80 }],
            [{ x: 80, y: 120 }, { x: 120, y: 120 }],
            [{ x: 120, y: 40 }, { x: 120, y: 160 }],
            [{ x: 80, y: 40 }, { x: 80, y: 160 }]
        ],
        checkpoints: [
            [{ x: 80, y: 80, radius: 20 }, { x: 100, y: 80, radius: 20 }, { x: 120, y: 80, radius: 20 }],
            [{ x: 80, y: 120, radius: 20 }, { x: 100, y: 120, radius: 20 }, { x: 120, y: 120, radius: 20 }],
            [{ x: 120, y: 40, radius: 20 }, { x: 120, y: 100, radius: 20 }, { x: 120, y: 160, radius: 20 }],
            [{ x: 80, y: 40, radius: 20 }, { x: 80, y: 100, radius: 20 }, { x: 80, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /ye/. Giống như ㅔ có thêm âm /y/ phía trước.',
        writingRule: 'Kết hợp ㅕ và ㅣ. Viết ㅕ trước, sau đó thêm ㅣ.',
        examples: [
          { word: '예', romanization: 'ye', meaning: 'vâng (trang trọng)' },
          { word: '시계', romanization: 'sigye', meaning: 'đồng hồ' },
        ],
      },
      {
        char: 'ㅘ',
        name: 'Wa',
        romanization: 'wa',
        strokes: [
            [{ x: 80, y: 40 }, { x: 80, y: 80 }], [{ x: 40, y: 80 }, { x: 120, y: 80 }],
            [{ x: 120, y: 40 }, { x: 120, y: 160 }], [{ x: 120, y: 100 }, { x: 160, y: 100 }]
        ],
        checkpoints: [
            [{ x: 80, y: 40, radius: 20 }, { x: 80, y: 80, radius: 20 }],
            [{ x: 40, y: 80, radius: 20 }, { x: 80, y: 80, radius: 20 }, { x: 120, y: 80, radius: 20 }],
            [{ x: 120, y: 40, radius: 20 }, { x: 120, y: 100, radius: 20 }, { x: 120, y: 160, radius: 20 }],
            [{ x: 120, y: 100, radius: 20 }, { x: 140, y: 100, radius: 20 }, { x: 160, y: 100, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /wa/, tương tự "oa" trong tiếng Việt.',
        writingRule: 'Kết hợp ㅗ và ㅏ. Viết ㅗ trước, sau đó viết ㅏ ngay cạnh.',
        examples: [
          { word: '과자', romanization: 'gwaja', meaning: 'bánh kẹo' },
          { word: '사과', romanization: 'sagwa', meaning: 'quả táo' },
        ],
      },
       {
        char: 'ㅙ',
        name: 'Wae',
        romanization: 'wae',
        strokes: [
            [{ x: 80, y: 40 }, { x: 80, y: 80 }], [{ x: 40, y: 80 }, { x: 120, y: 80 }],
            [{ x: 120, y: 40 }, { x: 120, y: 160 }], [{ x: 120, y: 100 }, { x: 160, y: 100 }], [{ x: 160, y: 40 }, { x: 160, y: 160 }]
        ],
        checkpoints: [
            [{ x: 80, y: 40, radius: 15 }, { x: 80, y: 80, radius: 15 }],
            [{ x: 40, y: 80, radius: 15 }, { x: 80, y: 80, radius: 15 }, { x: 120, y: 80, radius: 15 }],
            [{ x: 120, y: 40, radius: 15 }, { x: 120, y: 100, radius: 15 }, { x: 120, y: 160, radius: 15 }],
            [{ x: 120, y: 100, radius: 15 }, { x: 140, y: 100, radius: 15 }, { x: 160, y: 100, radius: 15 }],
            [{ x: 160, y: 40, radius: 15 }, { x: 160, y: 100, radius: 15 }, { x: 160, y: 160, radius: 15 }]
        ],
        pronunciationTip: 'Phát âm là /wae/, tương tự "oe" trong tiếng Việt nhưng có âm /w/ ở trước.',
        writingRule: 'Kết hợp ㅗ và ㅐ. Viết ㅗ trước, sau đó viết ㅐ ngay cạnh.',
        examples: [
          { word: '왜', romanization: 'wae', meaning: 'tại sao' },
          { word: '돼지', romanization: 'dwaeji', meaning: 'con lợn' },
        ],
      },
       {
        char: 'ㅚ',
        name: 'Oe',
        romanization: 'oe',
        strokes: [
            [{ x: 80, y: 40 }, { x: 80, y: 80 }], [{ x: 40, y: 80 }, { x: 120, y: 80 }],
            [{ x: 120, y: 40 }, { x: 120, y: 160 }]
        ],
        checkpoints: [
            [{ x: 80, y: 40, radius: 20 }, { x: 80, y: 80, radius: 20 }],
            [{ x: 40, y: 80, radius: 20 }, { x: 80, y: 80, radius: 20 }, { x: 120, y: 80, radius: 20 }],
            [{ x: 120, y: 40, radius: 20 }, { x: 120, y: 100, radius: 20 }, { x: 120, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /oe/, tương tự /we/. Giữ khẩu hình miệng của "ô" và phát âm "ê".',
        writingRule: 'Kết hợp ㅗ và ㅣ. Viết ㅗ trước, sau đó viết ㅣ ngay cạnh.',
        examples: [
          { word: '회사', romanization: 'hoesa', meaning: 'công ty' },
          { word: '외국', romanization: 'oeguk', meaning: 'nước ngoài' },
        ],
      },
       {
        char: 'ㅝ',
        name: 'Wo',
        romanization: 'wo',
        strokes: [
            [{ x: 40, y: 80 }, { x: 120, y: 80 }], [{ x: 80, y: 80 }, { x: 80, y: 120 }],
            [{ x: 80, y: 120 }, { x: 120, y: 120 }], [{ x: 120, y: 40 }, { x: 120, y: 160 }]
        ],
        checkpoints: [
            [{ x: 40, y: 80, radius: 20 }, { x: 80, y: 80, radius: 20 }, { x: 120, y: 80, radius: 20 }],
            [{ x: 80, y: 80, radius: 20 }, { x: 80, y: 100, radius: 20 }, { x: 80, y: 120, radius: 20 }],
            [{ x: 80, y: 120, radius: 20 }, { x: 100, y: 120, radius: 20 }, { x: 120, y: 120, radius: 20 }],
            [{ x: 120, y: 40, radius: 20 }, { x: 120, y: 100, radius: 20 }, { x: 120, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /wo/, tương tự "uơ" trong tiếng Việt.',
        writingRule: 'Kết hợp ㅜ và ㅓ. Viết ㅜ trước, sau đó viết ㅓ ngay cạnh.',
        examples: [
          { word: '뭐', romanization: 'mwo', meaning: 'cái gì' },
          { word: '원', romanization: 'won', meaning: 'đơn vị tiền Hàn Quốc' },
        ],
      },
       {
        char: 'ㅞ',
        name: 'We',
        romanization: 'we',
        strokes: [
            [{ x: 40, y: 80 }, { x: 120, y: 80 }], [{ x: 80, y: 80 }, { x: 80, y: 120 }],
            [{ x: 80, y: 120 }, { x: 120, y: 120 }], [{ x: 120, y: 40 }, { x: 120, y: 160 }], [{ x: 150, y: 40 }, { x: 150, y: 160 }]
        ],
        checkpoints: [
            [{ x: 40, y: 80, radius: 15 }, { x: 80, y: 80, radius: 15 }, { x: 120, y: 80, radius: 15 }],
            [{ x: 80, y: 80, radius: 15 }, { x: 80, y: 100, radius: 15 }, { x: 80, y: 120, radius: 15 }],
            [{ x: 80, y: 120, radius: 15 }, { x: 100, y: 120, radius: 15 }, { x: 120, y: 120, radius: 15 }],
            [{ x: 120, y: 40, radius: 15 }, { x: 120, y: 100, radius: 15 }, { x: 120, y: 160, radius: 15 }],
            [{ x: 150, y: 40, radius: 15 }, { x: 150, y: 100, radius: 15 }, { x: 150, y: 160, radius: 15 }]
        ],
        pronunciationTip: 'Phát âm là /we/, tương tự "uê" trong tiếng Việt.',
        writingRule: 'Kết hợp ㅜ và ㅔ. Viết ㅜ trước, sau đó viết ㅔ ngay cạnh.',
        examples: [
          { word: '웨이터', romanization: 'weiteo', meaning: 'bồi bàn' },
        ],
      },
       {
        char: 'ㅟ',
        name: 'Wi',
        romanization: 'wi',
        strokes: [
            [{ x: 40, y: 80 }, { x: 160, y: 80 }],
            [{ x: 100, y: 80 }, { x: 100, y: 120 }],
            [{ x: 100, y: 40 }, { x: 100, y: 160 }]
        ],
        checkpoints: [
            [{ x: 40, y: 80, radius: 20 }, { x: 100, y: 80, radius: 20 }, { x: 160, y: 80, radius: 20 }],
            [{ x: 100, y: 80, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 100, y: 120, radius: 20 }],
            [{ x: 100, y: 40, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 100, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /wi/, tương tự "uy" trong tiếng Việt.',
        writingRule: 'Kết hợp ㅜ và ㅣ. Viết ㅜ trước, sau đó viết ㅣ ngay cạnh.',
        examples: [
          { word: '위', romanization: 'wi', meaning: 'trên' },
          { word: '귀', romanization: 'gwi', meaning: 'cái tai' },
        ],
      },
       {
        char: 'ㅢ',
        name: 'Ui',
        romanization: 'ui',
        strokes: [
            [{ x: 40, y: 100 }, { x: 160, y: 100 }],
            [{ x: 160, y: 40 }, { x: 160, y: 160 }]
        ],
        checkpoints: [
            [{ x: 40, y: 100, radius: 20 }, { x: 100, y: 100, radius: 20 }, { x: 160, y: 100, radius: 20 }],
            [{ x: 160, y: 40, radius: 20 }, { x: 160, y: 100, radius: 20 }, { x: 160, y: 160, radius: 20 }]
        ],
        pronunciationTip: 'Phát âm là /ui/ khi đứng đầu. Phát âm là /i/ khi đứng sau phụ âm. Phát âm là /e/ khi là trợ từ sở hữu.',
        writingRule: 'Kết hợp ㅡ và ㅣ. Viết ㅡ trước, sau đó viết ㅣ ngay cạnh.',
        examples: [
          { word: '의사', romanization: 'uisa', meaning: 'bác sĩ' },
          { word: '저의', romanization: 'jeoui (jeo-e)', meaning: 'của tôi' },
        ],
      },
    ],
  },
];