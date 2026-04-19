export interface NewsItem {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export const newsItems: NewsItem[] = [
  {
    title: "TSE 13227 Standartlarında 2026 Güncellemesi Yayınlandı",
    slug: "tse-13227-2026-güncellemesi",
    excerpt: "İlaçlama sektörünün temel taşı olan TSE 13227 standartları, ekipman kalibrasyonu ve personel yetkinliği konularında yeni kriterler getirdi.",
    content: `
      <h2>İlaçlama Sektöründe Yeni Dönem</h2>
      <p>Türk Standartları Enstitüsü (TSE), 'İlaçlama Hizmetleri - Genel Kurallar' başlıklı 13227 sayılı standartta kapsamlı bir güncellemeye gitti. 2026 yılı itibarıyla yürürlüğe girecek olan bu düzenleme, ekipmanların kalibrasyonundan personel eğitim sertifikalarına kadar birçok alanda çıtayı yükseltti.</p>
      <h3>Neler Değişti?</h3>
      <ul>
        <li>Kullanılan tüm ilaçlama cihazlarının periyodik kalibrasyon zorunluluğu getirildi.</li>
        <li>Biyosidal ürün uygulama sorumlularının her 2 yılda bir tazeleme eğitimine girmesi şart koşuldu.</li>
        <li>Hizmet sonrası verilen raporların dijital izlenebilirlik standartları belirlendi.</li>
      </ul>
      <p>Büyükşehir İlaçlama olarak, tüm ekipman ve personel altyapımızı bu yeni standartlara göre %100 uyumlu hale getirdiğimizi bildirmekten gurur duyarız.</p>
    `,
    date: "2026-04-18",
    author: "TSE Denetim Ekibi",
    category: "Mevzuat",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070"
  },
  {
    title: "Sağlık Bakanlığı Biyosidal Ürün Takip Sistemi (BÜTS) Güncellendi",
    slug: "sağlık-bakanlığı-büts-güncellemesi",
    excerpt: "Biyosidal ürünlerin stok ve kullanım takibi için kullanılan BÜTS sistemi, karekod dönemi ile daha şeffaf hale geliyor.",
    content: `
      <h2>Güvenli İlaç, Şeffaf Takip</h2>
      <p>Sağlık Bakanlığı, halk sağlığını korumak amacıyla biyosidal ürünlerin takibinde 'Karekod' sistemine geçiş yaptı. Bu sayede kullanılan her ilacın üretim tarihinden, hangi adreste kullanıldığına kadar tüm süreç anlık olarak takip edilebilecek.</p>
      <p>Müşterilerimiz, ekiplerimizin kullandığı ürünlerin üzerindeki karekodları taratarak ürünün bakanlık onaylı olup olmadığını anında görebilecekler. Kaçak ve merdiven altı ilaç kullanımına karşı en büyük adım bu sistemle atılmış oldu.</p>
    `,
    date: "2026-04-17",
    author: "Sektör Haber",
    category: "Mevzuat",
    image: "https://images.unsplash.com/photo-1544634190-2c99fd0e0bc3?q=80&w=2070"
  },
  {
    title: "Sanayi Bölgelerinde TSE 13227 Belgesi Zorunluluğu Hakkında Duyuru",
    slug: "sanayi-bolgeleri-tse-zorunlulugu",
    excerpt: "Bursa OSB ve İstanbul İkitelli gibi büyük sanayi bölgelerindeki işletmelerin, periyodik ilaçlama hizmetini sadece TSE belgeli firmalardan alabileceği bildirildi.",
    content: `
      <h2>Kurumsal İşletmeler İçin Kritik Uyarı</h2>
      <p>Son yasal düzenlemelerle birlikte, özellikle gıda dışı üretim yapan fabrikalarda da haşere kontrol hizmeti alırken TSE 13227 Hizmet Yeterlilik Belgesi aranması şart koşuldu. Bu belgeye sahip olmayan firmalardan alınan hizmetler, iş güvenliği denetimlerinde geçersiz sayılacak.</p>
      <h3>Büyükşehir İlaçlama Olarak Hazırız</h3>
      <p>Firmamız, Bursa ve İstanbul'daki tüm sanayi bölgelerinde TSE standartlarında hizmet verme yetkisine sahiptir. Kullandığımız tüm metotlar, Avrupa standartları ve Türk mevzuatıyla %100 uyumludur.</p>
    `,
    date: "2026-04-18",
    author: "Büyükşehir Denetim",
    category: "Sanayi",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070"
  }
];
