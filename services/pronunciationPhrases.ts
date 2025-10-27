// services/pronunciationPhrases.ts

export interface PronunciationPhrase {
  korean: string;
  romanization: string;
}

export const pronunciationContexts: Record<string, { label: string; phrases: PronunciationPhrase[] }> = {
  general: {
    label: 'Chung',
    phrases: [
        { korean: "안녕하세요", romanization: "Annyeonghaseyo" },
        { korean: "감사합니다", romanization: "Gamsahamnida" },
        { korean: "죄송합니다", romanization: "Joesonghamnida" },
        { korean: "네, 맞아요", romanization: "Ne, majayo" },
        { korean: "아니요", romanization: "Aniyo" },
        { korean: "주말 잘 보내세요", romanization: "Jumal jal bonaeseyo" },
        { korean: "이름이 뭐예요?", romanization: "Ireumi mwoyeyo?" },
        { korean: "어디에서 왔어요?", romanization: "Eodieseo wasseoyo?" },
        { korean: "만나서 반갑습니다", romanization: "Mannaseo bangapseumnida" },
        { korean: "괜찮아요", romanization: "Gwaenchanayo" },
    ],
  },
  restaurant: {
    label: 'Nhà hàng',
    phrases: [
      { korean: "메뉴 좀 주세요", romanization: "Menyu jom juseyo" },
      { korean: "주문할게요", romanization: "Jumunhalgeyo" },
      { korean: "이거 주세요", romanization: "Igeo juseyo" },
      { korean: "물 좀 주세요", romanization: "Mul jom juseyo" },
      { korean: "계산해 주세요", romanization: "Gyesanhae juseyo" },
      { korean: "너무 맛있어요", romanization: "Neomu masisseoyo" },
      { korean: "잘 먹겠습니다", romanization: "Jal meokgetseumnida" },
      { korean: "잘 먹었습니다", romanization: "Jal meogeotseumnida" },
    ],
  },
  airport: {
    label: 'Sân bay',
    phrases: [
      { korean: "여권 보여주세요", romanization: "Yeogwon boyeojuseyo" },
      { korean: "탑승 시간은 언제예요?", romanization: "Tapseung siganeun eonjeyeyo?" },
      { korean: "제 짐을 못 찾겠어요", romanization: "Je jimeul mot chatgesseoyo" },
      { korean: "창가 자리로 주세요", romanization: "Changga jariro juseyo" },
      { korean: "비행기가 연착되었어요", romanization: "Bihaenggiga yeonchakdoeeosseoyo" },
    ],
  },
  shopping: {
    label: 'Mua sắm',
    phrases: [
      { korean: "이거 얼마예요?", romanization: "Igeo eolmayeyo?" },
      { korean: "너무 비싸요", romanization: "Neomu bissayo" },
      { korean: "깎아주세요", romanization: "Kkakka-juseyo" },
      { korean: "입어봐도 돼요?", romanization: "Ibeobwado dwaeyo?" },
      { korean: "더 큰 사이즈 있어요?", romanization: "Deo keun saijeu isseoyo?" },
      { korean: "카드로 계산할게요", romanization: "Kadeuro gyesanhalgeyo" },
    ]
  }
};