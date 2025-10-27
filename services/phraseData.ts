
export interface Phrase {
  korean: string;
  romanization: string;
  vietnamese: string;
}

export interface PhraseCategory {
  category: string;
  phrases: Phrase[];
}

export const commonPhrases: PhraseCategory[] = [
  {
    category: "Chào hỏi & Cơ bản",
    phrases: [
      { korean: "안녕하세요", romanization: "Annyeonghaseyo", vietnamese: "Xin chào" },
      { korean: "감사합니다", romanization: "Gamsahamnida", vietnamese: "Cảm ơn" },
      { korean: "죄송합니다", romanization: "Joesonghamnida", vietnamese: "Xin lỗi" },
      { korean: "네", romanization: "Ne", vietnamese: "Vâng / Đúng vậy" },
      { korean: "아니요", romanization: "Aniyo", vietnamese: "Không" },
      { korean: "괜찮아요", romanization: "Gwaenchanayo", vietnamese: "Không sao đâu" },
      { korean: "안녕히 가세요", romanization: "Annyeonghi gaseyo", vietnamese: "Tạm biệt (Khi bạn ở lại, người khác đi)" },
      { korean: "안녕히 계세요", romanization: "Annyeonghi gyeseyo", vietnamese: "Tạm biệt (Khi bạn đi, người khác ở lại)" },
      { korean: "제 이름은 ...입니다", romanization: "Je ireumeun ...imnida", vietnamese: "Tên tôi là ..." },
      { korean: "만나서 반갑습니다", romanization: "Mannaseo bangapseumnida", vietnamese: "Rất vui được gặp bạn" },
    ]
  },
  {
    category: "Tại nhà hàng",
    phrases: [
      { korean: "메뉴 좀 주세요", romanization: "Menyu jom juseyo", vietnamese: "Cho tôi xem thực đơn" },
      { korean: "주문할게요", romanization: "Jumunhalgeyo", vietnamese: "Tôi muốn gọi món" },
      { korean: "이거 주세요", romanization: "Igeo juseyo", vietnamese: "Cho tôi món này" },
      { korean: "물 좀 주세요", romanization: "Mul jom juseyo", vietnamese: "Cho tôi xin nước" },
      { korean: "계산해 주세요", romanization: "Gyesanhae juseyo", vietnamese: "Tính tiền cho tôi" },
      { korean: "화장실이 어디예요?", romanization: "Hwajangsiri eodiyeyo?", vietnamese: "Nhà vệ sinh ở đâu ạ?" },
      { korean: "너무 맛있어요", romanization: "Neomu masisseoyo", vietnamese: "Ngon quá" },
      { korean: "포장해 주세요", romanization: "Pojanghae juseyo", vietnamese: "Làm ơn gói mang về cho tôi" },
    ]
  },
  {
    category: "Mua sắm",
    phrases: [
      { korean: "이거 얼마예요?", romanization: "Igeo eolmayeyo?", vietnamese: "Cái này bao nhiêu tiền?" },
      { korean: "너무 비싸요", romanization: "Neomu bissayo", vietnamese: "Đắt quá" },
      { korean: "깎아주세요", romanization: "Kkakka-juseyo", vietnamese: "Giảm giá cho tôi được không?" },
      { korean: "입어봐도 돼요?", romanization: "Ibeobwado dwaeyo?", vietnamese: "Tôi có thể mặc thử được không?" },
      { korean: "더 큰 사이즈 있어요?", romanization: "Deo keun saijeu isseoyo?", vietnamese: "Có cỡ lớn hơn không?" },
      { korean: "더 작은 사이즈 있어요?", romanization: "Deo jageun saijeu isseoyo?", vietnamese: "Có cỡ nhỏ hơn không?" },
      { korean: "카드로 계산할게요", romanization: "Kadeuro gyesanhalgeyo", vietnamese: "Tôi sẽ trả bằng thẻ" },
      { korean: "봉투 하나 주세요", romanization: "Bongtu hana juseyo", vietnamese: "Cho tôi xin một cái túi" },
    ]
  },
  {
    category: "Tại sân bay",
    phrases: [
      { korean: "여권 보여주세요", romanization: "Yeogwon boyeojuseyo", vietnamese: "Xin cho xem hộ chiếu" },
      { korean: "이 비행기는 어디서 타요?", romanization: "I bihaenggineun eodiseo tayo?", vietnamese: "Tôi có thể lên chuyến bay này ở đâu?" },
      { korean: "탑승 시간은 언제예요?", romanization: "Tapseung siganeun eonjeyeyo?", vietnamese: "Thời gian lên máy bay là khi nào?" },
      { korean: "제 짐을 못 찾겠어요", romanization: "Je jimeul mot chatgesseoyo", vietnamese: "Tôi không tìm thấy hành lý của mình" },
      { korean: "창가 자리로 주세요", romanization: "Changga jariro juseyo", vietnamese: "Cho tôi ghế gần cửa sổ" },
      { korean: "통로 쪽 자리로 주세요", romanization: "Tongno jjok jariro juseyo", vietnamese: "Cho tôi ghế gần lối đi" },
      { korean: "와이파이 비밀번호가 뭐예요?", romanization: "Waipai bimilbeonhoga mwoyeyo?", vietnamese: "Mật khẩu Wi-Fi là gì?" },
    ]
  },
  {
    category: "Di chuyển & Hỏi đường",
    phrases: [
        { korean: "실례합니다", romanization: "Sillyehamnida", vietnamese: "Xin lỗi (để bắt chuyện)" },
        { korean: "...에 어떻게 가요?", romanization: "...e eotteoke gayo?", vietnamese: "Đi đến ... như thế nào?" },
        { korean: "지하철역이 어디에 있어요?", romanization: "Jihacheollyeogi eodie isseoyo?", vietnamese: "Ga tàu điện ngầm ở đâu?" },
        { korean: "이 버스는 동대문에 가요?", romanization: "I beoseuneun Dongdaemun-e gayo?", vietnamese: "Xe buýt này có đi đến Dongdaemun không?" },
        { korean: "여기서 내려 주세요.", romanization: "Yeogiseo naeryeo juseyo.", vietnamese: "Cho tôi xuống ở đây." },
        { korean: "다음 정류장은 어디예요?", romanization: "Daeum jeongnyujang-eun eodiyeyo?", vietnamese: "Trạm tiếp theo là ở đâu?" },
        { korean: "택시를 불러 주세요.", romanization: "Taeksireul bulleo juseyo.", vietnamese: "Xin hãy gọi taxi giúp tôi." },
        { korean: "이 주소로 가주세요.", romanization: "I jusoro gajuseyo.", vietnamese: "Hãy đi đến địa chỉ này." },
    ]
  },
  {
    category: "Tại khách sạn",
    phrases: [
        { korean: "체크인하고 싶어요.", romanization: "Chekeu-inhago sipeoyo.", vietnamese: "Tôi muốn nhận phòng." },
        { korean: "예약했어요. 제 이름은 ...입니다.", romanization: "Yeyakhaesseoyo. Je ireumeun ...imnida.", vietnamese: "Tôi đã đặt phòng. Tên tôi là..." },
        { korean: "아침 식사는 몇 시예요?", romanization: "Achim siksaneun myeot siyeyo?", vietnamese: "Bữa sáng lúc mấy giờ?" },
        { korean: "방을 청소해 주세요.", romanization: "Bang-eul cheongsohae juseyo.", vietnamese: "Xin hãy dọn phòng giúp tôi." },
        { korean: "수건 좀 더 주시겠어요?", romanization: "Sugeon jom deo jusigesseoyo?", vietnamese: "Có thể cho tôi thêm khăn tắm được không?" },
        { korean: "체크아웃할게요.", romanization: "Chekeu-authalgeyo.", vietnamese: "Tôi muốn trả phòng." },
    ]
  },
  {
    category: "Trường hợp khẩn cấp",
    phrases: [
        { korean: "도와주세요!", romanization: "Dowajuseyo!", vietnamese: "Cứu tôi với!" },
        { korean: "경찰을 불러 주세요.", romanization: "Gyeongchareul bulleo juseyo.", vietnamese: "Hãy gọi cảnh sát!" },
        { korean: "구급차를 불러 주세요.", romanization: "Gugeupchareul bulleo juseyo.", vietnamese: "Hãy gọi xe cứu thương!" },
        { korean: "여기가 아파요.", romanization: "Yeogiga apayo.", vietnamese: "Tôi bị đau ở đây." },
        { korean: "지갑을 잃어버렸어요.", romanization: "Jigabeul ireobeoryeosseoyo.", vietnamese: "Tôi bị mất ví rồi." },
        { korean: "길을 잃었어요.", romanization: "Gireul ireosseoyo.", vietnamese: "Tôi bị lạc đường." },
        { korean: "병원에 가고 싶어요.", romanization: "Byeong-won-e gago sipeoyo.", vietnamese: "Tôi muốn đi bệnh viện." },
    ]
  },
  {
    category: "Kết bạn",
    phrases: [
        { korean: "취미가 뭐예요?", romanization: "Chwimiga mwoyeyo?", vietnamese: "Sở thích của bạn là gì?" },
        { korean: "저는 영화 보는 것을 좋아해요.", romanization: "Jeoneun yeonghwa boneun geoseul joahaeyo.", vietnamese: "Tôi thích xem phim." },
        { korean: "주말에 보통 뭐 하세요?", romanization: "Jumare botong mwo haseyo?", vietnamese: "Cuối tuần bạn thường làm gì?" },
        { korean: "시간 있으면 같이 식사할래요?", romanization: "Sigan isseumyeon gachi siksalhaeyo?", vietnamese: "Nếu có thời gian, bạn có muốn đi ăn cùng tôi không?" },
        { korean: "연락처 좀 알려주시겠어요?", romanization: "Yeollakcheo jom allyeojusigesseoyo?", vietnamese: "Bạn có thể cho tôi thông tin liên lạc được không?" },
        { korean: "나이가 어떻게 되세요?", romanization: "Na-iga eotteoke doeseyo?", vietnamese: "Bạn bao nhiêu tuổi? (lịch sự)" },
    ]
  }
];
