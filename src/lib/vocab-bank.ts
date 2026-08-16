export type VocabEntry = {
  word: string;
  ipa: string;
  meaning: string;
  example: string;
};

export type VocabTopic = {
  key: string;
  name: string;
  vi: string;
  words: VocabEntry[];
};

export const VOCAB_TOPICS: VocabTopic[] = [
  {
    key: "education",
    name: "Education",
    vi: "Giáo dục",
    words: [
      {
        word: "compulsory education",
        ipa: "/kəmˈpʌlsəri ˌedʒuˈkeɪʃn/",
        meaning: "giáo dục bắt buộc",
        example:
          "Extending compulsory education to the age of eighteen would equip teenagers with essential vocational skills.",
      },
      {
        word: "rote learning",
        ipa: "/rəʊt ˈlɜːnɪŋ/",
        meaning: "học vẹt, học thuộc lòng máy móc",
        example:
          "An over-reliance on rote learning stifles students' capacity for independent thought.",
      },
      {
        word: "tuition fees",
        ipa: "/tjuˈɪʃn fiːz/",
        meaning: "học phí",
        example:
          "Soaring tuition fees have made higher education financially prohibitive for low-income families.",
      },
      {
        word: "hands-on experience",
        ipa: "/ˌhændz ˈɒn ɪkˈspɪəriəns/",
        meaning: "kinh nghiệm thực hành",
        example:
          "Internships provide undergraduates with hands-on experience that lectures alone cannot deliver.",
      },
      {
        word: "well-rounded curriculum",
        ipa: "/wel ˈraʊndɪd kəˈrɪkjələm/",
        meaning: "chương trình học toàn diện",
        example:
          "A well-rounded curriculum should balance academic rigour with creative and physical activities.",
      },
    ],
  },
  {
    key: "environment",
    name: "Environment",
    vi: "Môi trường",
    words: [
      {
        word: "carbon footprint",
        ipa: "/ˈkɑːbən ˈfʊtprɪnt/",
        meaning: "lượng khí thải carbon (dấu chân carbon)",
        example:
          "Commuting by public transport is one of the simplest ways to reduce one's carbon footprint.",
      },
      {
        word: "renewable energy",
        ipa: "/rɪˈnjuːəbl ˈenədʒi/",
        meaning: "năng lượng tái tạo",
        example:
          "Governments should subsidise renewable energy to curb dependence on fossil fuels.",
      },
      {
        word: "depletion of natural resources",
        ipa: "/dɪˈpliːʃn əv ˈnætʃrəl rɪˈsɔːsɪz/",
        meaning: "sự cạn kiệt tài nguyên thiên nhiên",
        example:
          "Unchecked industrial expansion accelerates the depletion of natural resources.",
      },
      {
        word: "ecological balance",
        ipa: "/ˌiːkəˈlɒdʒɪkl ˈbæləns/",
        meaning: "cân bằng sinh thái",
        example:
          "Deforestation disrupts the ecological balance on which countless species depend.",
      },
      {
        word: "eco-friendly practices",
        ipa: "/ˈiːkəʊ ˈfrendli ˈpræktɪsɪz/",
        meaning: "các thói quen thân thiện với môi trường",
        example:
          "Financial incentives can encourage households to adopt eco-friendly practices.",
      },
    ],
  },
  {
    key: "technology",
    name: "Technology",
    vi: "Công nghệ",
    words: [
      {
        word: "digital literacy",
        ipa: "/ˈdɪdʒɪtl ˈlɪtərəsi/",
        meaning: "năng lực số, khả năng sử dụng công nghệ",
        example:
          "Digital literacy is now as indispensable as numeracy in the modern workplace.",
      },
      {
        word: "automation",
        ipa: "/ˌɔːtəˈmeɪʃn/",
        meaning: "sự tự động hoá",
        example:
          "Automation may render many manual occupations obsolete within a decade.",
      },
      {
        word: "screen addiction",
        ipa: "/skriːn əˈdɪkʃn/",
        meaning: "nghiện thiết bị điện tử",
        example:
          "Screen addiction among adolescents has been linked to declining academic performance.",
      },
      {
        word: "data privacy",
        ipa: "/ˈdeɪtə ˈprɪvəsi/",
        meaning: "quyền riêng tư dữ liệu",
        example:
          "Stricter legislation is required to safeguard data privacy in the age of social media.",
      },
      {
        word: "technological breakthrough",
        ipa: "/ˌteknəˈlɒdʒɪkl ˈbreɪkθruː/",
        meaning: "bước đột phá công nghệ",
        example:
          "Recent technological breakthroughs in medicine have dramatically extended life expectancy.",
      },
    ],
  },
  {
    key: "health",
    name: "Health",
    vi: "Sức khoẻ",
    words: [
      {
        word: "sedentary lifestyle",
        ipa: "/ˈsedntri ˈlaɪfstaɪl/",
        meaning: "lối sống ít vận động",
        example:
          "A sedentary lifestyle is a leading contributor to obesity and cardiovascular disease.",
      },
      {
        word: "preventive healthcare",
        ipa: "/prɪˈventɪv ˈhelθkeə/",
        meaning: "y tế phòng ngừa",
        example:
          "Investing in preventive healthcare is far more cost-effective than treating chronic illnesses.",
      },
      {
        word: "mental well-being",
        ipa: "/ˈmentl wel ˈbiːɪŋ/",
        meaning: "sức khoẻ tinh thần",
        example:
          "Excessive working hours can severely undermine employees' mental well-being.",
      },
      {
        word: "life expectancy",
        ipa: "/laɪf ɪkˈspektənsi/",
        meaning: "tuổi thọ trung bình",
        example:
          "Improved sanitation has raised life expectancy in developing nations considerably.",
      },
      {
        word: "processed food",
        ipa: "/ˈprəʊsest fuːd/",
        meaning: "thực phẩm chế biến sẵn",
        example:
          "Heavy taxation on processed food could discourage unhealthy dietary habits.",
      },
    ],
  },
  {
    key: "work",
    name: "Work",
    vi: "Công việc",
    words: [
      {
        word: "job satisfaction",
        ipa: "/dʒɒb ˌsætɪsˈfækʃn/",
        meaning: "sự hài lòng trong công việc",
        example:
          "Job satisfaction often outweighs salary when graduates choose their first employer.",
      },
      {
        word: "work-life balance",
        ipa: "/ˌwɜːk laɪf ˈbæləns/",
        meaning: "cân bằng công việc và cuộc sống",
        example:
          "Flexible schedules allow employees to maintain a healthier work-life balance.",
      },
      {
        word: "remote working",
        ipa: "/rɪˈməʊt ˈwɜːkɪŋ/",
        meaning: "làm việc từ xa",
        example:
          "Remote working has significantly reduced commuting costs for urban professionals.",
      },
      {
        word: "career progression",
        ipa: "/kəˈrɪə prəˈɡreʃn/",
        meaning: "lộ trình phát triển sự nghiệp",
        example:
          "Clear career progression pathways help companies retain their most talented staff.",
      },
      {
        word: "job security",
        ipa: "/dʒɒb sɪˈkjʊərəti/",
        meaning: "sự ổn định trong công việc",
        example:
          "Many workers prioritise job security over higher pay during economic downturns.",
      },
    ],
  },
];
