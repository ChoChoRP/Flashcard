const dataString = `
〜 (まる) ごと,〜 (まる) ごと,"seluruh ~, semua ~",N2
(かさを～) さす,(かさを～) さす,membuka; memegang (payung),N2
～(日本) 式,～(にほん) しき,"adat,",N2
～位,～い,~tempat ke,N2
～いち (にほんいち),～いち (にほんいち),No. 1 ~ (di),N2
～園,～えん,~ taman (terutama buatan manusia),N2
～おしまい (おわり),～おしまい (おわり),berakhir ~,N2
～日,～か,penghitung hari,N2
～下,～か,di bawah ~,N2
～化,～か,tindakan membuat sesuatu,N2
～科,～か,"keluarga, kelompok, kursus",N2
～歌,～か,lagu ~,N2
～画,～が,"gambar, lukisan",N2
～外,～がい,di luar ~,N2
～難い,～がたい,sulit (sulit) melakukan ~,N2
～がち,～がち,cenderung melakukan ~,N2
～刊,～かん,"~ terbitan (majalah, koran)",N2
～間,～かん,"antara, selama",N2
～巻,～かん,volume,N2
～館,～かん,"~ aula, ~ gedung",N2
～感,～かん,"perasaan, indra, kesan",N2
～期,～き,"~usia, ~periode",N2
～器,～き,"perangkat, peralatan",N2
～機,～き,mesin,N2
～気味,～ぎみ,sedikit ~,N2
～教,～きょう,agama,N2
～行,～ぎょう,"baris, baris",N2
～業,～ぎょう,jenis bisnis,N2
～きる,～きる,"namun, untuk melaksanakan",N2
～切れ,～きれ,kehabisan ~,N2
～口,～くち,"~ bukaan; ~ pintu masuk, ~ pintu keluar",N2
～家,～け,"keluarga ~, rumah ~",N2
～形,～けい,bentuk ~,N2
～系,～けい,"~ sistem, ~ garis keturunan, ~ kelompok",N2
～圏,～けん,"blok, bola, area",N2
～校,～こう,penghitung sekolah,N2
～港,～こう,~ pelabuhan,N2
～号,～ごう,penghitung majalah; nama kapal,N2
～国,～こく,bangsa ~,N2
～毎,～ごと,"setiap ~, masing-masing ~",N2
～山,～さん,nama gunung,N2
～産,～さん,dibuat di ~,N2
～史,～し,sejarah ~,N2
～紙,～し,"koran, jenis kertas",N2
～寺,～じ,nama kuil,N2
～時間目,～じかんめ,"~jam ke, ~periode ke",N2
～室,～しつ,penghitung kamar,N2
～日,～じつ,hari,N2
～車,～しゃ,~ mobil,N2
～者,～しゃ,orang,N2
～社,～しゃ,penghitung perusahaan,N2
～手,～しゅ,"~ pemain, orang yang melakukan ~",N2
～酒,～しゅ,jenis alkohol,N2
～集,～しゅう,koleksi ~,N2
～所,～しょ,tempat,N2
～所,～じょ,tempat,N2
～女,～じょ,penghitung saudara perempuan,N2
～省,～しょう,jenis kementerian,N2
～商,～しょう,"pedagang, bisnis",N2
～勝,～しょう,penghitung kemenangan,N2
～条,～じょう,penghitung artikel,N2
～場,～じょう,"jenis lapangan, tanah",N2
～畳,～じょう,"penghitung tatami, tikar",N2
～色,～しょく,jenis warna,N2
～過ぎる,～すぎる,terlalu banyak ~,N2
～済,～ずみ,selesai,N2
～席,～せき,penghitung kursi,N2
～船,～せん,penghitung kapal,N2
～戦,～せん,"penghitung permainan, pertandingan",N2
～前,～ぜん,sebelum ~,N2
～沿い,～そい,sepanjang,N2
～艘,～そう,penghitung kapal,N2
～足,～そく,penghitung sepatu,N2
～だらけ,～だらけ,"penuh dengan ~, dipenuhi dengan ~",N2
～団,～だん,"kelompok, korps, partai",N2
～着,～ちゃく,penghitung pakaian; tempat finis,N2
～庁,～ちょう,"kantor, agensi",N2
～兆,～ちょう,triliun,N2
～長,～ちょう,"pemimpin, kepala",N2
～帳,～ちょう,"~ buku, buku catatan",N2
～丁目,～ちょうめ,"~ distrik (kota; kota, blok)",N2
～通,～つう,penghitung surat,N2
～遣い,～づかい,penggunaan ~,N2
～付,～つき,dengan ~,N2
～続く,～つづく,"mengikuti, melanjutkan, terus",N2
～辛い,～づらい,sulit melakukan ~,N2
～滴,～てき,jatuh,N2
～点,～てん,penghitung skor,N2
～頭,～とう,penghitung hewan,N2
～等,～とう,"tingkat, tempat",N2
～島,～とう,jenis pulau,N2
～道,～どう,"jenis jalan, jalan",N2
～通り,～とおり,"sesuai dengan ~; mengikuti ~; ~ jalan, ~ avenue",N2
～ところ,～ところ,akan melakukan ~,N2
～内,～ない,di dalam ~,N2
～年生,～ねんせい,penghitung tahun ajaran,N2
～泊,～はく,"penghitung menginap (misalnya, 2 malam)",N2
～発,～はつ,penghitung peluru,N2
～番目,～ばんめ,~ke,N2
～費,～ひ,biaya ~,N2
～病,～びょう,jenis penyakit,N2
～部,～ぶ,~ bagian,N2
～風,～ふう,~ gaya,N2
～振り,～ぶり,setelah selang waktu ~,N2
～遍,～へん,waktu,N2
～弁,～べん,"pidato, dialek",N2
～歩,～ほ,"langkah, kecepatan",N2
～ぽい,～ぽい,~ish,N2
～ほう (ひかく),～ほう (ひかく),(sebagai perbandingan),N2
～みたい,～みたい,terlihat seperti ~,N2
～向け,～むけ,untuk ~,N2
～名,～めい,penghitung orang,N2
～もち,～もち,orang yang memiliki ~,N2
～問,～もん,penghitung pertanyaan,N2
～夜,～や,penghitung malam,N2
～等,～ら,orang jamak,N2
～流,～りゅう,"fashion, cara, cara",N2
～料,～りょう,"ongkos, biaya",N2
～領,～りょう,wilayah,N2
～力,～りょく,kekuatan ~,N2
～論,～ろん,teori,N2
～羽,～わ,penghitung kelinci; burung,N2
相変わらず,あいかわらず,"seperti biasa, seperti biasa, seperti sebelumnya, seperti biasa, tetap",N2
アイデア; アイディア,アイデア; アイディア,ide,N2
あいまい,あいまい,"samar-samar, ambigu",N2
扇ぐ,あおぐ,"mengipasi, mengepakkan",N2
青白い,あおじろい,pucat,N2
呆れる,あきれる,"terkejut, terperanjat",N2
アクセント,アクセント,aksen,N2
あくび,あくび,menguap,N2
飽くまで,あくまで,"sampai akhir, sampai akhir, dengan keras kepala",N2
明くる～,あくる～,"berikutnya, berikut",N2
明け方,あけがた,fajar,N2
憧れる,あこがれる,"merindukan, merindukan",N2
朝寝坊,あさねぼう,"kesiangan, bangun siang",N2
足跡,あしあと,jejak kaki,N2
足元,あしもと,di kaki seseorang,N2
味わう,あじわう,"merasakan, menikmati",N2
預かる,あずかる,"menyimpan dalam tahanan, menerima sebagai simpanan, mengurus",N2
温まる,あたたまる,menghangatkan diri,N2
当たり前,あたりまえ,"wajar, masuk akal, jelas, biasa, umum, biasa, biasa, norma",N2
あちらこちら,あちらこちら,di sana-sini,N2
厚かましい,あつかましい,"kurang ajar, tidak tahu malu,",N2
圧縮,あっしゅく,"kompresi, kondensasi, tekanan",N2
宛名,あてな,"alamat, arah",N2
当てはまる,あてはまる,"berlaku, termasuk dalam (kategori)",N2
当てはめる,あてはめる,"menerapkan, mengadaptasi",N2
暴れる,あばれる,"bertindak kasar, mengamuk",N2
脂,あぶら,"lemak, lemak, lemak babi",N2
あぶる,あぶる,"menghanguskan, memanggang",N2
あふれる,あふれる,"banjir, meluap",N2
雨戸,あまど,pintu geser badai,N2
甘やかす,あまやかす,"memanjakan, memanjakan",N2
余る,あまる,"tersisa, berlebih",N2
編み物,あみもの,rajutan,N2
あみもの,あみもの,"rajutan, jaring",N2
編む,あむ,merajut,N2
危うい,あやうい,"berbahaya, kritis",N2
怪しい,あやしい,"mencurigakan, meragukan, meragukan",N2
荒い,あらい,"kasar, tidak sopan, liar",N2
粗い,あらい,"kasar, kasar",N2
粗筋,あらすじ,"garis besar, sinopsis",N2
争う,あらそう,"bersaing, memperebutkan, bersaing untuk bertengkar, berdebat, berselisih, berselisih, menentang",N2
改めて,あらためて,"lain kali, lagi",N2
改める,あらためる,"mengubah, mereformasi, merevisi",N2
あらわす,あらわす,"menulis, menerbitkan",N2
有難い,ありがたい,"bersyukur, berterima kasih, dihargai",N2
あれこれ,あれこれ,"satu dan lain hal, ini dan itu",N2
荒れる,あれる,"menjadi badai, menjadi kasar, menjadi hancur",N2
慌ただしい,あわただしい,"sibuk, tergesa-gesa",N2
慌てる,あわてる,"menjadi bingung (bingung, tidak teratur), bingung, panik, terburu-buru, terburu-buru, bergegas",N2
安易,あんい,santai,N2
案外,あんがい,"tidak terduga, mengejutkan",N2
アンテナ,アンテナ,antena,N2
言い出す,いいだす,"mulai berbicara, menyarankan",N2
言い付ける,いいつける,"memberitahu, memerintahkan",N2
意義,いぎ,"makna, signifikansi",N2
生き生き,いきいき,"dengan jelas, dengan hidup",N2
いきなり,いきなり,tiba-tiba,N2
幾～,いく～,beberapa ~,N2
育児,いくじ,"perawatan anak, perawatan",N2
幾分,いくぶん,agak,N2
生け花,いけばな,rangkaian bunga,N2
以後,いご,setelah ini; mulai sekarang; selanjutnya,N2
イコール,イコール,sama,N2
以降,いこう,"dan setelah, selanjutnya",N2
勇ましい,いさましい,"berani, gagah berani",N2
衣食住,いしょくじゅう,"makanan, pakaian dan tempat tinggal",N2
いちいち,いちいち,"satu per satu, secara terpisah",N2
一応,いちおう,"untuk sementara, untuk saat ini",N2
一段と,いちだんと,"jauh, lebih besar",N2
一流,いちりゅう,"kelas satu, terkemuka",N2
一昨日,いっさくじつ,kemarin lusa,N2
一昨年,いっさくねん,tahun lalu,N2
一斉,いっせい,"serentak, sekaligus",N2
一旦,いったん,"sekali, sejenak",N2
一定,いってい,"tetap, mapan, teratur",N2
行っていらっしゃい,いっていらっしゃい,"semoga harimu menyenangkan, sampai jumpa",N2
いってきます,いってきます,"(Lit.) Saya akan pergi dan kembali, 'Saya pergi, sampai jumpa lagi'",N2
いってまいります,いってまいります,"(Lit.) Saya akan pergi dan kembali, 'Saya pergi, sampai jumpa lagi'",N2
行ってらっしゃい,いってらっしゃい,"semoga harimu menyenangkan, sampai jumpa",N2
移転,いてん,"pindah, transfer",N2
井戸,いど,sumur air,N2
緯度,いど,lintang (navigasi),N2
威張る,いばる,"bangga, sombong",N2
嫌がる,いやがる,"enggan, tidak suka",N2
いよいよ,いよいよ,"semakin, semakin, akhirnya",N2
煎る,いる,memanggang,N2
炒る,いる,"menggoreng, memanggang",N2
入れ物,いれもの,"wadah, kotak",N2
インキ,インキ,tinta,N2
引力,いんりょく,gravitasi,N2
ウーマン,ウーマン,wanita,N2
ウール,ウール,wol,N2
ウエートレス,ウエートレス,pelayan,N2
植木,うえき,"semak taman, pohon, tanaman pot",N2
飢える,うえる,kelaparan,N2
浮ぶ,うかぶ,"mengapung, naik ke permukaan, terlintas di benak",N2
浮かべる,うかべる,mengapung; mengekspresikan,N2
浮く,うく,mengapung,N2
承る,うけたまわる,"(rendah hati) mendengar, diberitahu, tahu",N2
受取,うけとり,kuitansi,N2
受け持つ,うけもつ,mengambil (bertanggung jawab) atas,N2
薄暗い,うすぐらい,"redup, suram",N2
薄める,うすめる,"mengencerkan, mengencerkan",N2
打合せ,うちあわせ,"pertemuan bisnis, pengaturan sebelumnya",N2
打ち消す,うちけす,"menyangkal, meniadakan",N2
写る,うつる,"difoto, diproyeksikan",N2
うどん,うどん,mie udon (mie tradisional Jepang),N2
うなずく,うなずく,mengangguk,N2
有無,うむ,"ada atau tidaknya, ada tidaknya persetujuan atau penolakan, ya atau tidak",N2
埋める,うめる,"mengubur, mengisi, mengisi (kursi, posisi kosong)",N2
敬う,うやまう,"menghormati, menghormati",N2
裏返す,うらがえす,"membalik, membalik (sesuatu)",N2
裏口,うらぐち,"pintu belakang, pintu masuk belakang",N2
占う,うらなう,"meramal, meramal",N2
恨み,うらみ,dendam,N2
恨む,うらむ,"mengutuk, merasa pahit",N2
羨む,うらやむ,iri,N2
売上,うりあげ,"jumlah terjual, hasil",N2
売り上げ,うりあげ,"jumlah terjual, penjualan, hasil, pendapatan, omset",N2
売り切れ,うりきれ,habis terjual,N2
売り切れる,うりきれる,habis terjual,N2
売行き,うれゆき,penjualan,N2
売れ行き,うれゆき,"penjualan, permintaan",N2
うろうろ,うろうろ,"berkeliaran, berkeliaran tanpa tujuan",N2
上～,うわ～,atas ~,N2
運河,うんが,"kanal, jalur air",N2
うんと,うんと,"banyak sekali, sangat banyak",N2
英文,えいぶん,kalimat dalam bahasa Inggris,N2
英和,えいわ,"Inggris-Jepang (misalnya, kamus)",N2
ええと,ええと,"coba saya lihat, yah, eh...",N2
液体,えきたい,"cairan, fluida",N2
エチケット,エチケット,etiket,N2
絵の具,えのぐ,"warna, cat",N2
エプロン,エプロン,celemek,N2
偉い,えらい,"hebat, termasyhur, luar biasa,",N2
宴会,えんかい,"pesta, perjamuan",N2
園芸,えんげい,"hortikultura, berkebun",N2
演劇,えんげき,drama (teater),N2
円周,えんしゅう,lingkar,N2
遠足,えんそく,"perjalanan, pendakian, piknik",N2
延長,えんちょう,"perpanjangan, perpanjangan",N2
煙突,えんとつ,cerobong asap,N2
オーケストラ,オーケストラ,orkestra,N2
オートメーション,オートメーション,otomatisasi,N2
追いかける,おいかける,mengejar atau mengejar seseorang,N2
追い越す,おいこす,"melewati (misalnya, mobil), mendahului, melampaui",N2
オイル,オイル,minyak,N2
応援,おうえん,"bantuan, pertolongan, bantuan, dukungan, bala bantuan sorak-sorai, mendukung (untuk), dukungan",N2
王女,おうじょ,putri,N2
応ずる,おうずる,"menanggapi, mematuhi",N2
応接,おうせつ,penerimaan,N2
応対,おうたい,"menerima, berurusan dengan",N2
往復,おうふく,"(kol) pulang pergi, datang dan pergi, tiket pulang pergi",N2
欧米,おうべい,"Eropa dan Amerika, Barat",N2
応用,おうよう,"aplikasi, diterapkan secara praktis",N2
おおざっぱ,おおざっぱ,"kasar (tidak tepat), luas, samar",N2
大通り,おおどおり,jalan utama,N2
大凡,おおよそ,"sekitar, kira-kira",N2
お帰り,おかえり,"kembali, selamat datang",N2
おかけください,おかけください,silakan duduk,N2
おかげさまで,おかげさまで,"Terima kasih Tuhan, terima kasih",N2
おかず,おかず,"lauk, pendamping hidangan nasi",N2
おかまいなく,おかまいなく,tolong jangan repot-repot,N2
拝む,おがむ,"menyembah, berdoa",N2
お代わり,おかわり,"porsi kedua, cangkir lagi",N2
補う,おぎなう,mengkompensasi,N2
お気の毒に,おきのどくに,turut berduka cita…,N2
屋外,おくがい,di luar ruangan,N2
送り仮名,おくりがな,bagian kata yang ditulis dalam kana,N2
お元気で,おげんきで,Jaga diri',N2
怠る,おこたる,"mengabaikan, gagal",N2
押さえる,おさえる,"menekan, menahan, menekan, menahan di tempat, menahan tetap untuk menutupi (terutama bagian tubuh seseorang dengan tangan seseorang), memegang (bagian tubuh yang sakit), menekan (bagian tubuh) untuk mendapatkan, memperoleh, merebut, menangkap, menahan",N2
お先に,おさきに,"sebelumnya, silakan",N2
伯父,おじ,paman (lebih tua dari orang tua seseorang),N2
叔父,おじ,paman (lebih muda dari orang tua seseorang),N2
惜しい,おしい,"menyesal, mengecewakan",N2
伯父さん,おじさん,"(hormat) tuan setengah baya, paman",N2
小父さん,おじさん,"(hormat) tuan setengah baya, paman",N2
叔父さん,おじさん,"(hormat) tuan setengah baya, paman",N2
お邪魔します,おじゃまします,Permisi mengganggu,N2
お世話になりました,おせわになりました,Terima kasih atas bantuan Anda,N2
お大事に,おだいじに,"Jaga diri baik-baik, Jaga diri!, Semoga lekas sembuh",N2
落着く,おちつく,"menjadi tenang, menenangkan diri",N2
お出掛け,おでかけ,jalan-jalan,N2
お手伝いさん,おてつだいさん,pembantu,N2
脅かす,おどかす,"mengancam, memaksa",N2
落し物,おとしもの,barang hilang,N2
驚かす,おどろかす,"mengejutkan, menakuti",N2
お願いします,おねがいします,"Tolong (harfiah, saya minta)",N2
各々,おのおの,"masing-masing, setiap",N2
伯母,おば,bibi (lebih tua dari orang tua),N2
叔母,おば,bibi (lebih muda dari orang tua),N2
小母さん,おばさん,"wanita, ibu, nyonya",N2
おはよう,おはよう,(singkatan) Selamat pagi,N2
お参り,おまいり,"beribadah, kunjungan ke kuil",N2
お待たせしました,おまたせしました,Maaf membuat Anda menunggu,N2
`;
