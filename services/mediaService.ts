import type { MediaContent, LyricLine } from '../types';

const friendsConversation: LyricLine[] = [
    { timestamp: 0.5, korean: '지은아, 오랜만이야! 잘 지냈어?', romanization: 'Ji-eun-a, oraenman-iya! Jal jinaess-eo?', vietnamese: 'Ji-eun, lâu rồi không gặp! Cậu khỏe không?' },
    { timestamp: 3.2, korean: '민수야! 나도 너 보고 싶었어. 잘 지냈지?', romanization: 'Minsu-ya! Nado neo bogo sip-eoss-eo. Jal jinaessji?', vietnamese: 'Min-su! Tớ cũng nhớ cậu lắm. Cậu khỏe chứ?' },
    { timestamp: 6.5, korean: '응, 나 잘 지냈어. 요즘 뭐해?', romanization: 'Eung, na jal jinaess-eo. Yojeum mwohae?', vietnamese: 'Ừ, tớ khỏe. Dạo này cậu làm gì?' },
    { timestamp: 8.8, korean: '나? 회사에서 새로운 프로젝트 시작했어. 바빠 죽겠어!', romanization: 'Na? Hoesa-eseo saeroun peurojekteu sijakhaess-eo. Bappa juggess-eo!', vietnamese: 'Tớ á? Tớ bắt đầu dự án mới ở công ty. Bận chết đi được!' },
    { timestamp: 12.5, korean: '와, 진짜? 어떤 프로젝트야?', romanization: 'Wa, jinjja? Eotteon peurojekteu-ya?', vietnamese: 'Wow, thật á? Dự án gì vậy?' },
    { timestamp: 14.8, korean: '마케팅 캠페인 관련된 거야. 새 제품 출시 준비하고 있어.', romanization: 'Maketing kaempein gwallyeondoen geo-ya. Sae jepum chulsi junbihago iss-eo.', vietnamese: 'Liên quan đến chiến dịch marketing. Đang chuẩn bị ra mắt sản phẩm mới.' },
    { timestamp: 19.0, korean: '멋지다! 힘들어도 재미있겠다.', romanization: 'Meosjida! Himdeul-eodo jaemiissgessda.', vietnamese: 'Ngầu thật! Chắc là vất vả nhưng cũng vui lắm nhỉ.' },
    { timestamp: 21.5, korean: '응, 재미있긴 한데 스트레스도 많아. 너는 요즘 어때?', romanization: 'Eung, jaemiissgin hande seuteureseudo manh-a. Neoneun yojeum eottae?', vietnamese: 'Ừ, cũng vui nhưng mà stress lắm. Còn cậu dạo này thế nào?' },
    { timestamp: 25.5, korean: '나? 그냥 대학원 준비하고 있어. 논문 때문에 정신없어.', romanization: 'Na? Geunyang daehag-won junbihago iss-eo. Nonmun ttaemun-e jeongsin-eobs-eo.', vietnamese: 'Tớ á? Tớ đang chuẩn bị học cao học. Luận văn làm tớ rối tung cả lên.' },
    { timestamp: 30.0, korean: '오, 대학원? 어떤 전공 공부할 건지 정했어?', romanization: 'O, daehag-won? Eotteon jeongong gongbuhal geonji jeonghaess-eo?', vietnamese: 'Ồ, cao học á? Cậu quyết định học chuyên ngành gì chưa?' },
    { timestamp: 33.5, korean: '컴퓨터 공학 쪽으로 갈까 생각 중이야. AI에 관심 많아.', romanization: 'Keompyuteo gonghag jjog-uro galkka saeng-gag jung-iya. AI-e gwansim manh-a.', vietnamese: 'Tớ đang nghĩ đến ngành Khoa học máy tính. Tớ rất quan tâm đến AI.' },
    { timestamp: 38.0, korean: 'AI? 대박! 그거 미래 산업 아니야?', romanization: 'AI? Daebak! Geugeo mirae san-eob aniya?', vietnamese: 'AI? Đỉnh thật! Đó chẳng phải là ngành của tương lai sao?' },
    { timestamp: 41.0, korean: '하하, 맞아. 근데 공부할 게 많아서 걱정이야.', romanization: 'Haha, maja. Geunde gongbuhal ge manh-aseo geogjeong-iya.', vietnamese: 'Haha, đúng rồi. Nhưng mà có nhiều thứ phải học quá nên tớ cũng lo.' },
    { timestamp: 44.5, korean: '그래도 너라면 잘할 거야. 공부 열심히 하는 스타일이잖아!', romanization: 'Geuraedo neolamyeon jalhal geoya. Gongbu yeolsimhi haneun seutail-ijanh-a!', vietnamese: 'Nhưng mà cậu thì sẽ làm tốt thôi. Cậu là kiểu người chăm học mà!' },
    { timestamp: 49.0, korean: '고마워! 지은이는 주말에 뭐해?', romanization: 'Gomawo! Ji-eun-ineun jumal-e mwohae?', vietnamese: 'Cảm ơn cậu! Ji-eun cuối tuần làm gì?' },
    { timestamp: 51.5, korean: '나? 주말엔 보통 넷플릭스 보거나 친구들이랑 카페 가.', romanization: 'Na? Jumal-en botong nespeulligseu bogeona chingudeul-ilang kape ga.', vietnamese: 'Tớ á? Cuối tuần tớ thường xem Netflix hoặc đi cà phê với bạn bè.' },
    { timestamp: 56.0, korean: '오, 카페? 추천할 만한 카페 있어?', romanization: 'O, kape? Chucheonhal manhan kape iss-eo?', vietnamese: 'Ồ, cà phê á? Có quán nào đáng để giới thiệu không?' },
    { timestamp: 58.8, korean: '홍대 근처에 새로 생긴 카페 있는데 분위기 좋아. 갈래?', romanization: 'Hongdae geuncheo-e saelo saeng-gin kape issneunde bun-wigi joh-a. Gallae?', vietnamese: 'Có một quán cà phê mới mở gần Hongdae không khí tốt lắm. Đi không?' },
    { timestamp: 63.0, korean: '좋아! 언제 갈까? 토요일 어때?', romanization: 'Joh-a! Eonje galkka? To-yoil eottae?', vietnamese: 'Được đó! Khi nào đi? Thứ Bảy thì sao?' },
    { timestamp: 65.5, korean: '토요일 좋지! 오후 3시쯤 어때?', romanization: 'To-yoil johji! Ohu 3sijjeum eottae?', vietnamese: 'Thứ Bảy được đó! Khoảng 3 giờ chiều thì sao?' },
    { timestamp: 68.0, korean: '완벽해! 그럼 거기서 만나자.', romanization: 'Wanbyeoghae! Geuleom geogiseo mannaja.', vietnamese: 'Hoàn hảo! Vậy hẹn gặp ở đó nhé.' },
    { timestamp: 70.5, korean: '좋아, 그럼 토요일 3시에 그 카페 앞에서 만나!', romanization: 'Joh-a, geuleom to-yoil 3si-e geu kape ap-eseo manna!', vietnamese: 'OK, vậy hẹn gặp trước quán cà phê đó lúc 3 giờ thứ Bảy nhé!' },
    { timestamp: 74.5, korean: '오, 기대된다! 그 카페 이름이 뭐야?', romanization: 'O, gidaedoenda! Geu kape ileum-i mwoya?', vietnamese: 'Ồ, mong chờ quá! Tên quán cà phê là gì vậy?' },
    { timestamp: 77.5, korean: '‘달빛 카페’야. 디저트 맛있어!', romanization: '‘Dalbit Kape’ya. Dijeoteu mas-iss-eo!', vietnamese: '‘Dalbit Cafe’ đó. Món tráng miệng ngon lắm!' },
    { timestamp: 80.5, korean: '달빛 카페? 기억했어. 디저트 뭐가 제일 맛있어?', romanization: 'Dalbit Kape? Gieoghaess-eo. Dijeoteu mwoga jeil mas-iss-eo?', vietnamese: 'Dalbit Cafe? Tớ nhớ rồi. Món tráng miệng nào ngon nhất?' },
    { timestamp: 84.5, korean: '초코 케이크 강추! 진짜 부드럽고 맛있어.', romanization: 'Choko keikeu gangchu! Jinjja budeuleobgo mas-iss-eo.', vietnamese: 'Tớ cực kỳ đề cử bánh sô cô la! Mềm và ngon lắm.' },
    { timestamp: 88.0, korean: '와, 침고인다. 같이 먹어보자!', romanization: 'Wa, chimg-oinda. Gat-i meog-eoboja!', vietnamese: 'Wow, chảy nước miếng luôn. Cùng ăn thử đi!' },
    { timestamp: 90.5, korean: '좋아! 근데 민수야, 요즘 운동해?', romanization: 'Joh-a! Geunde Minsu-ya, yojeum undonghae?', vietnamese: 'OK! Nhưng mà Min-su này, dạo này cậu có tập thể dục không?' },
    { timestamp: 93.5, korean: '응, 가끔 러닝해. 지은이는?', romanization: 'Eung, gakkeum leoninghae. Ji-eun-ineun?', vietnamese: 'Ừ, tớ thỉnh thoảng chạy bộ. Còn Ji-eun thì sao?' },
    { timestamp: 95.8, korean: '나 요가 시작했어. 몸이 훨씬 가벼워졌어!', romanization: 'Na yoga sijaghaess-eo. Mom-i hwolssin gabyeowojyeoss-eo!', vietnamese: 'Tớ bắt đầu tập yoga. Người nhẹ nhõm hơn hẳn!' }
];

const grammarVideoParticles: LyricLine[] = [
    { timestamp: 1.0, korean: "안녕하세요!", romanization: "Annyeonghaseyo!", vietnamese: "Xin chào!" },
    { timestamp: 2.5, korean: "오늘은 장소 조사 ‘에’와 ‘에서’를 배워볼 거예요.", romanization: "Oneul-eun jangso josa ‘e’wa ‘eseo’leul baewobol geo-yeyo.", vietnamese: "Hôm nay chúng ta sẽ học về trợ từ địa điểm ‘에’ và ‘에서’." },
    { timestamp: 7.0, korean: "‘에’는 장소에 존재하거나 가는 목적지를 나타내요.", romanization: "‘E’neun jangso-e jonjaehageona ganeun mogjeogjileul natanaeyo.", vietnamese: "‘에’ biểu thị sự tồn tại ở một nơi hoặc điểm đến." },
    { timestamp: 12.2, korean: "예를 들어, '저는 집에 있어요.'", romanization: "Yeleul deul-eo, 'Jeoneun jib-e iss-eoyo.'", vietnamese: "Ví dụ, 'Tôi đang ở nhà.'" },
    { timestamp: 15.5, korean: "그리고 '학교에 가요.'", romanization: "Geuligo 'haggyo-e gayo.'", vietnamese: "Và 'Tôi đi đến trường.'" },
    { timestamp: 18.0, korean: "반면에 ‘에서’는 행동이 일어나는 장소를 나타내요.", romanization: "Banmyeon-e ‘eseo’neun haengdong-i il-eonaneun jangsoleul natanaeyo.", vietnamese: "Mặt khác, ‘에서’ biểu thị nơi một hành động diễn ra." },
    { timestamp: 23.8, korean: "예를 들어, '도서관에서 공부해요.'", romanization: "Yeleul deul-eo, 'doseogwan-eseo gongbuhaeyo.'", vietnamese: "Ví dụ, 'Tôi học ở thư viện.'" },
    { timestamp: 27.5, korean: "그리고 '식당에서 밥을 먹어요.'", romanization: "Geuligo 'sigdang-eseo bab-eul meog-eoyo.'", vietnamese: "Và 'Tôi ăn cơm ở nhà hàng.'" },
    { timestamp: 31.0, korean: "이제 차이점을 아시겠죠?", romanization: "Ije chaijeom-eul asigessjyo?", vietnamese: "Bây giờ các bạn đã hiểu sự khác biệt rồi chứ?" },
];

const grammarVideoPastTense: LyricLine[] = [
    { timestamp: 1.0, korean: "과거 시제 ‘았/었/였다’를 배워봅시다.", romanization: "Gwageo sije ‘ass/eoss/yeossda’leul baewobobsida.", vietnamese: "Chúng ta hãy cùng học thì quá khứ ‘았/었/였다’." },
    { timestamp: 5.2, korean: "동사나 형용사의 마지막 모음이 ‘아’나 ‘오’이면 ‘았어요’를 사용해요.", romanization: "Dongsa na hyeong-yongsa-ui majimag mo-eum-i ‘a’na ‘o’imyeon ‘ass-eoyo’leul sayonghaeyo.", vietnamese: "Nếu nguyên âm cuối của động từ/tính từ là ‘아’ hoặc ‘오’, chúng ta dùng ‘았어요’." },
    { timestamp: 11.8, korean: "예를 들어, '가다'는 '갔어요'가 됩니다.", romanization: "Yeleul deul-eo, 'gada'neun 'gass-eoyo'ga doebnida.", vietnamese: "Ví dụ, '가다' (đi) trở thành '갔어요' (đã đi)." },
    { timestamp: 15.6, korean: "'보다'는 '봤어요'가 됩니다.", romanization: "'Boda'neun 'bwass-eoyo'ga doebnida.", vietnamese: "'보다' (nhìn) trở thành '봤어요' (đã nhìn)." },
    { timestamp: 18.5, korean: "다른 모든 모음은 ‘었어요’를 사용해요.", romanization: "Daleun modeun mo-eum-eun ‘eoss-eoyo’leul sayonghaeyo.", vietnamese: "Tất cả các nguyên âm khác thì dùng ‘었어요’." },
    { timestamp: 23.0, korean: "예를 들어, '먹다'는 '먹었어요'가 됩니다.", romanization: "Yeleul deul-eo, 'meogda'neun 'meog-eoss-eoyo'ga doebnida.", vietnamese: "Ví dụ, '먹다' (ăn) trở thành '먹었어요' (đã ăn)." },
    { timestamp: 27.0, korean: "마지막으로, ‘하다’ 동사는 항상 ‘했어요’가 됩니다.", romanization: "Majimag-eulo, ‘hada’ dongsa neun hangsang ‘haess-eoyo’ga doebnida.", vietnamese: "Cuối cùng, động từ ‘하다’ (làm) luôn trở thành ‘했어요’ (đã làm)." },
    { timestamp: 32.5, korean: "예: '공부하다'는 '공부했어요'입니다.", romanization: "Ye: 'gongbuhada'neun 'gongbuhaess-eoyo'ibnida.", vietnamese: "Ví dụ: '공부하다' (học) là '공부했어요' (đã học)." },
];

// This is the source of truth for the sample media content as requested by the user.
let sampleMedia: MediaContent[] = [
  {
    id: 'long-conversation-friends',
    type: 'audio',
    category: 'conversation',
    title: 'Trò chuyện cùng bạn bè',
    artistOrDrama: 'Hội thoại đời sống',
    audioUrl: 'https://storage.googleapis.com/korean-learning-hub-media/long_conversation_friends.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1949&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    lyrics: friendsConversation,
  },
  {
    id: 'grammar-video-particles',
    type: 'video',
    category: 'grammar',
    title: 'Cách dùng 에 và 에서',
    artistOrDrama: 'Ngữ pháp Sơ cấp',
    videoUrl: 'https://storage.googleapis.com/korean-learning-hub-media/grammar_video_particles.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534398374972-2a7a4a613c74?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    lyrics: grammarVideoParticles,
  },
  {
    id: 'grammar-video-past-tense',
    type: 'video',
    category: 'grammar',
    title: 'Thì quá khứ 았/었/였다',
    artistOrDrama: 'Ngữ pháp Sơ cấp',
    videoUrl: 'https://storage.googleapis.com/korean-learning-hub-media/grammar_video_past_tense.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519624114258-404543152016?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    lyrics: grammarVideoPastTense,
  },
];

export const getMediaContent = (): MediaContent[] => {
  return sampleMedia;
};

export const addMediaContent = (newMedia: MediaContent): void => {
    // Add to the start of the array to make it visible first.
    sampleMedia.unshift(newMedia);
};