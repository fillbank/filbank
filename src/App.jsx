import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, onValue, get, child } from 'firebase/database'
import './App.css'

const firebaseConfig = {
  apiKey: "AIzaSyC_fVrBWXf7dAavafMeRBDLFrUqrg6FeeE",
  authDomain: "fillbank.firebaseapp.com",
  databaseURL: "https://fillbank-default-rtdb.firebaseio.com",
  projectId: "fillbank",
  storageBucket: "fillbank.firebasestorage.app",
  messagingSenderId: "687655169383",
  appId: "1:687655169383:web:7342ecec0cce90b63553c2",
  measurementId: "G-RLEYSCRSWP"
}
const fbApp = initializeApp(firebaseConfig)
const db = getDatabase(fbApp)

const connection = new Connection('https://api.mainnet-beta.solana.com')
const DONATION_ADDRESS_SOL = '7xK4f2vL9mN3pQ8rT5wY7uI1oP6aS9dF'
const DONATION_ADDRESS_USDT = 'ETkmY37T9tKmwNzxLrNrLh6GdphDEDAB6qWfdywEGf8p'

const translations = {
  ru: {
    'logo.sub': 'CRYPTO BANK',
    'h3d.sub': 'SOLANA ECOSYSTEM',
    'nav.features': '✦ Возможности',
    'nav.advantages': '★ Преимущества',
    'nav.mining': '⚡ Майнинг',
    'wallet.connect': 'Подключить кошелёк',
    'wallet.connecting': 'Подключение...',
    'wallet.install': 'Установи кошелёк Solana: phantom.app',
    'wallet.error': 'Ошибка подключения',
    'wallet.select': 'Выберите кошелёк',
    'wallet.none': 'Не найден ни один кошелёк',
    'wallet.disconnect': 'Отключить',
    'hero.badge': '🚀 Solana Ecosystem',
    'hero.title1': 'Твой инновационный',
    'hero.title2': 'крипто-банк',
    'hero.subtitle': 'Стейкинг, DeFi лендинг, браузерный майнинг',
    'hero.subtitle2': 'и собственный токен',
    'hero.stat.users': 'Пользователей',
    'hero.stat.tvl': 'TVL',
    'hero.stat.features': 'Функции',
    'features.title': 'Возможности FilBank',
    'features.subtitle': 'Инновационные DeFi инструменты на Solana',
    'feature.staking.title': 'Стейкинг $FILB',
    'feature.staking.desc': 'До 25% годовых на токен $FILB. Автоматический компаунд, ежедневные выплаты.',
    'feature.lending.title': 'DeFi Лендинг',
    'feature.lending.desc': 'Моментальные займы под залог $FILB и SOL. Только смарт-контракты, без посредников.',
    'feature.invest.title': 'Авто-инвестиции',
    'feature.invest.desc': 'Умные портфели с ребалансировкой. Копи-трейдинг лучших стратегий на Solana.',
    'feature.mining.title': 'Браузерный майнинг',
    'feature.mining.desc': 'PoW майнинг $FILB прямо в браузере. Не нужны ASIC, видеокарты и вложения.',
    'card.title': 'Карта FilBank',
    'card.subtitle': 'Современная крипто-карта для платежей по всему миру',
    'card.feature1.title': 'Виртуальная и физическая',
    'card.feature1.desc': 'Мгновенный выпуск, доставка в любую точку мира',
    'card.feature2.title': 'Авто-конвертация',
    'card.feature2.desc': '$FILB → USDC → Фиат по лучшему курсу',
    'card.feature3.title': 'Кешбек 5% в $FILB',
    'card.feature3.desc': 'На каждую покупку с карты FilBank',
    'adv.title': 'Почему FilBank лучше банка?',
    'adv.subtitle': 'Сравнение традиционных банков и FilBank на Solana',
    'adv1.title': 'Трансграничность',
    'adv1.desc': 'Традиционные банки: недели на переводы, SWIFT, комиссии до 5%. FilBank: секунды, копеечные комиссии, никаких границ.',
    'adv2.title': 'Без цензуры',
    'adv2.desc': 'Банк может заблокировать счёт по любой причине. FilBank работает на смарт-контрактах — никто не заморозит твои средства.',
    'adv3.title': 'Доходность',
    'adv3.desc': 'В банке — 0.01% на остаток. В FilBank — до 25% годовых через стейкинг и DeFi.',
    'adv4.title': 'Свой токен $FILB',
    'adv4.desc': 'У банков нет своих токенов. $FILB — это и валюта, и актив, и ключ к экосистеме. Запустим и на USDT.',
    'adv5.title': 'Solana — скорость света',
    'adv5.desc': '50 000 транзакций в секунду, $0.0002 за перевод. Банки мечтают о такой эффективности.',
    'adv6.title': 'Автоматизация',
    'adv6.desc': 'Стейкинг, лендинг, майнинг — всё работает без участия человека. Банки берут за каждое действие комиссию.',
    'mining.badge': '⚡ ПРОРЫВ',
    'mining.title': 'Браузерный майнинг $FILB',
    'mining.desc': 'Proof-of-Work прямо в браузере. Без установок, без вложений, без границ.',
    'mining.power': 'Мощность',
    'mining.mined': '$FILB добыто',
    'mining.status': 'Статус',
    'mining.active': 'Активен',
    'mining.stopped': 'Остановлен',
    'mining.start': '▶ Начать майнинг',
    'mining.stop': '⏹ Остановить майнинг',
    'roadmap.title': '🗺 Карта действий FilBank',
    'roadmap.subtitle': 'План развития экосистемы на 2026 год',
    'roadmap1.title': 'Запуск сайта и кошелька',
    'roadmap1.desc': 'Подключение Phantom, отображение баланса SOL',
    'roadmap2.title': 'Токен $FILB на Pump.fun',
    'roadmap2.desc': 'SPL токен с ликвидностью и торговлей на Pump.fun',
    'roadmap3.title': 'Листинг на Raydium + стейкинг',
    'roadmap3.desc': 'DEX листинг и смарт-контракт с доходностью в SOL/USDC',
    'roadmap4.title': 'DeFi Лендинг + $FILB/USDT',
    'roadmap4.desc': 'Запуск лендинга и второй токен $FILB на USDT',
    'roadmap5.title': 'Браузерный майнинг + карты',
    'roadmap5.desc': 'PoW майнинг в браузере и выпуск физических карт FilBank',
    'footer.desc': 'Децентрализованный крипто-банк на Solana',
    'profile.title': 'Личный кабинет',
    'profile.balance': 'Баланс',
    'profile.filb': '$FILB',
    'profile.username': 'Имя пользователя',
    'profile.save': 'Сохранить',
    'profile.saved': 'Сохранено',
    'profile.no': 'Без имени',
    'profile.logout': 'Выйти',
    'profile.edit': 'Редактировать',
    'profile.save': 'Сохранить',
    'profile.saved': 'Сохранено',
    'profile.changePass': 'Сменить пароль',
    'profile.connectWallet': 'Подключить кошелёк',
    'profile.linkedWallet': 'Кошелёк привязан',
    'profile.noWallet': 'Кошелёк не привязан',
    'profile.deposit': 'Пополнить',
    'profile.withdraw': 'Вывести',
    'profile.history': 'История транзакций',
    'profile.noTx': 'Пока нет транзакций',
    'profile.staking': 'Стейкинг $FILB',
    'profile.stakingDesc': 'Подключите кошелёк для стейкинга',
    'auth.register': 'Регистрация',
    'auth.login': 'Вход',
    'auth.email': 'Почта',
    'auth.password': 'Пароль',
    'auth.confirm': 'Подтвердите пароль',
    'auth.registerBtn': 'Создать аккаунт',
    'auth.loginBtn': 'Войти',
    'auth.noAccount': 'Нет аккаунта?',
    'auth.hasAccount': 'Уже есть аккаунт?',
    'auth.wrongPass': 'Неверный пароль',
    'auth.userNotFound': 'Пользователь не найден',
    'auth.emailExists': 'Эта почта уже зарегистрирована',
    'auth.shortPass': 'Минимум 6 символов',
    'auth.passMismatch': 'Пароли не совпадают',
    'auth.registered': 'Аккаунт создан! Добро пожаловать!',
    'auth.loggedIn': 'Добро пожаловать!',
    'hq.title': 'Штаб-квартира FilBank',
    'hq.subtitle': 'Будущее децентрализованного банкинга — голографический небоскрёб на Solana',
    'hq.card1.title': 'Архитектура',
    'hq.card1.desc': '28-этажный кристаллический небоскрёб с голографическим фасадом, реагирующим на блокчейн-транзакции в реальном времени',
    'hq.card2.title': 'Территория',
    'hq.card2.desc': 'Целый городской квартал: паркинг, ботанический сад, вертолётная площадка для VIP-клиентов',
    'hq.card3.title': 'Энергетика',
    'hq.card3.desc': 'Собственная солнечная ферма и майнинг-центр, питающий здание от Proof-of-Stake возобновляемой энергии Solana',
    'hq.card4.title': 'Безопасность',
    'hq.card4.desc': 'Биометрическая защита, квантовое шифрование, децентрализованные серверы под землёй на глубине 50 метров',
    'hq.spec.year': 'Год открытия',
    'hq.spec.height': 'Высота',
    'hq.spec.area': 'Площадь (м²)',
    'hq.spec.vision': 'Масштаб видения',
    'launch.title': '$FILB Token Launch',
    'launch.subtitle': 'Токен $FILB готовится к запуску. Следите за обновлениями!',
    'launch.soon': 'СКОРО',
    'launch.dev': 'В РАЗРАБОТКЕ',
    'launch.phase': 'Фаза',
    'launch.phase1': 'Привлечение',
    'launch.phase2': 'Листинг',
    'launch.phase3': 'Запуск',
    'launch.notify': 'Уведомить меня',
    'launch.emailPH': 'Ваш email',
    'launch.subscribed': 'Вы подписаны!',
    'launch.days': 'Дней',
    'launch.hours': 'Часов',
    'launch.minutes': 'Минут',
    'launch.seconds': 'Секунд',
    'launch.progress': 'Прогресс разработки',
    'launch.progressVal': '47%',
    'footer.brand': 'Децентрализованный крипто-банк нового поколения на Solana',
    'footer.product': 'Продукт',
    'footer.resources': 'Ресурсы',
    'footer.legal': 'Юридическое',
    'footer.staking': 'Стейкинг',
    'footer.mining': 'Майнинг',
    'footer.defi': 'DeFi',
    'footer.docs': 'Документация',
    'footer.github': 'GitHub',
    'footer.blog': 'Блог',
    'footer.careers': 'Карьера',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
    'footer.audit': 'Аудит безопасности',
    'footer.copy': '© 2026 FilBank. Все права защищены.',
    'footer.built': 'Построено на Solana',
    'map.title': 'FilBank в мире',
    'map.subtitle': 'Пользователи со всего мира уже присоединяются',
    'map.total': 'Всего пользователей',
    'map.countries': 'Стран',
    'map.online': 'Онлайн',
    'map.reg': 'Регистрация',
    'map.yourCountry': 'Ваша страна',
    'auth.country': 'Страна',
    'support.title': 'Поддержать FilBank',
    'support.subtitle': 'Помоги нам запустить токен $FILB и развить экосистему. Любая сумма — вклад в будущее.',
    'support.goal2': 'Листинг на Pump.fun',
    'support.goal3': 'Оборудование и софт',
    'support.totalRaised': 'Всего собрано',
    'support.note': 'Адреса только для донатов. Токен $FILB пока не выпущен — будьте осторожны с мошенниками.',
    'support.telegram': 'Telegram канал',
    'support.twitter': 'Twitter/X',
    'support.donateSOL': 'Донат SOL',
    'support.donateUSDT': 'Донат USDT',
    'og.title': 'Стань OG FilBank',
    'og.subtitle': 'Подключи кошелёк, сделай репост и вступи в Telegram — получи OG-статус и эксклюзивные награды.',
    'og.step1': 'Кошелёк',
    'og.step2': 'Соцсети',
    'og.step3': 'Подтверждение',
    'og.step1Title': 'Подключи кошелёк Solana',
    'og.step1Desc': 'Для получения OG-статуса и будущего эирдропа нужен подключенный кошелёк.',
    'og.step2Title': 'Выполни социальные задания',
    'og.step2Desc': 'Сделай репост закреплённого твита и вступи в официальный Telegram-канал.',
    'og.step3Title': 'Подтверди участие',
    'og.step3Desc': 'Проверь данные и отправь заявку на OG-статус.',
    'og.connectWallet': 'Подключить кошелёк',
    'og.walletConnected': 'Кошелёк подключён',
    'og.twitterTask': 'Twitter / X',
    'og.twitterTaskDesc': 'Сделай репост закреплённого твита @FilBankOfficial',
    'og.telegramTask': 'Telegram',
    'og.telegramTaskDesc': 'Вступи в официальный канал @FilBankofficial',
    'og.openTwitter': 'Открыть Twitter',
    'og.openTelegram': 'Открыть Telegram',
    'og.twitterHandle': 'Твой @ в Twitter',
    'og.telegramUser': 'Твой @ в Telegram',
    'og.verify': 'Подтвердить',
    'og.verified': 'Подтверждено',
    'og.enterTwitter': 'Введи Twitter @',
    'og.enterTelegram': 'Введи Telegram @',
    'og.verifyBoth': 'Подтверди оба задания',
    'og.connectWalletFirst': 'Сначала подключи кошелёк',
    'og.wallet': 'Кошелёк',
    'og.twitter': 'Twitter',
    'og.telegram': 'Telegram',
    'og.back': 'Назад',
    'og.next': 'Далее',
    'og.submit': 'Получить OG-статус',
    'og.submitting': 'Отправка...',
    'og.successTitle': '🎉 Ты OG!',
    'og.successDesc': 'Твоя заявка принята. Ожидай распределения токенов и эксклюзивных привилегий.',
    'og.reward1': 'OG-роль в Discord/Telegram',
    'og.reward2': 'Приоритетный аллокация $FILB',
    'og.reward3': 'Доступ к приватным IDO/пресейлам',
    'og.reward4': 'Специальные NFT и мерч',
    'og.close': 'Закрыть',
    'og.error': 'Ошибка при отправке',
    'partners.becomePartner': 'Стань партнёром',
    'partners.formDesc': 'Хочешь разместить проект в экосистеме FilBank? Заполни форму — мы свяжемся с тобой.',
    'partners.name': 'Название проекта',
    'partners.namePH': 'Название твоего проекта',
    'partners.contact': 'Контакт (Telegram / Email / Twitter)',
    'partners.contactPH': '@username или email',
    'partners.details': 'Детали предложения',
    'partners.detailsPH': 'Что предлагаешь? Коллаб, реклама, интеграция...',
    'partners.submit': 'Отправить заявку',
    'partners.successTitle': 'Заявка отправлена!',
    'partners.successDesc': 'Мы рассмотрим и свяжемся с тобой в течение 24 часов.',
    'partners.another': 'Отправить ещё',
    'admin.title': 'Админ-панель',
    'admin.ogParticipants': 'OG-участники',
    'admin.donations': 'Донаты',
    'admin.partners': 'Партнёры',
    'admin.wallet': 'Кошелёк',
    'admin.twitter': 'Twitter',
    'admin.telegram': 'Telegram',
    'admin.date': 'Дата',
    'admin.status': 'Статус',
    'admin.rewardClaimed': 'Награда',
    'admin.type': 'Тип',
    'admin.amount': 'Сумма',
    'admin.txId': 'TX ID',
    'admin.name': 'Название',
    'admin.contact': 'Контакт',
    'admin.details': 'Детали',
    'admin.search': 'Поиск...',
    'admin.noData': 'Данных нет',
    'admin.exportCSV': 'Экспорт CSV',
    'admin.prepareAirdrop': 'Подготовить для эирдропа',
    'admin.addDonation': 'Записать донат',
    'admin.addOG': 'Добавить OG',
    'admin.add': 'Добавить',
    'admin.pinPrompt': 'Введи пин-код для входа в админку',
    'faq.title': 'Частые вопросы',
    'faq.subtitle': 'Ответы на самые популярные вопросы о FilBank',
    'faq.q1': 'Что такое FilBank?',
    'faq.a1': 'FilBank — это децентрализованный крипто-банк на блокчейне Solana. Мы предлагаем стейкинг, DeFi-лендинг, браузерный майнинг и собственный токен $FILB.',
    'faq.q2': 'Когда выйдет токен $FILB?',
    'faq.a2': 'Мы находимся в фазе разработки. Токен будет запущен через Pump.fun, после чего будет листинг на DEX. Следите за обновлениями в наших соцсетях.',
    'faq.q3': 'Как заработать на FilBank?',
    'faq.a3': 'Вы можете заработать через стейкинг токенов $FILB (до 25% годовых), DeFi-лендинг (проценты от займов), а также браузерный майнинг прямо на сайте.',
    'faq.q4': 'Безопасны ли мои средства?',
    'faq.a4': 'Да. FilBank работает на смарт-контрактах Solana. Ваши средства всегда под вашим контролем. Никто не может заморозить или забрать ваши токены.',
    'faq.q5': 'Как подключить кошелёк?',
    'faq.a5': 'Нажмите "Подключить кошелёк" и выберите Phantom, Solflare, Backpack или другой совместимый кошелёк. На телефоне — откройте сайт через приложение кошелька.',
    'faq.q6': 'Нужны ли вложения для майнинга?',
    'faq.a6': 'Нет. Браузерный майнинг полностью бесплатный. Просто нажмите "Начать майнинг" и $FILB начнут поступать на ваш аккаунт.',
    'faq.q7': 'FilBank — это не scams?',
    'faq.a7': 'Нет. Мы прозрачный проект: открытый код, публичный профиль команды, аудит смарт-контрактов. Мы строим долгосрочный проект, а не quick scam.',
    'partners.title': 'Экосистема',
    'partners.subtitle': 'FilBank интегрирован с ведущими проектами Solana',
    'wallet.connectBtn': 'Подключить через',
    'wallet.mobileHint': 'Откройте этот сайт в приложении кошелька',
    'wallet.noWalletTitle': 'Установите кошелёк',
    'wallet.getPhantom': 'Установить Phantom',
    'wallet.getSolflare': 'Установить Solflare',
    'wallet.getBackpack': 'Установить Backpack',
    'wallet.getLogin': 'Войти',
  },
  en: {
    'logo.sub': 'CRYPTO BANK',
    'h3d.sub': 'SOLANA ECOSYSTEM',
    'nav.features': '✦ Features',
    'nav.advantages': '★ Advantages',
    'nav.mining': '⚡ Mining',
    'wallet.connect': 'Connect Wallet',
    'wallet.connecting': 'Connecting...',
    'wallet.install': 'Install Solana wallet: phantom.app',
    'wallet.error': 'Connection error',
    'wallet.select': 'Select Wallet',
    'wallet.none': 'No wallet found',
    'wallet.disconnect': 'Disconnect',
    'hero.badge': '🚀 Solana Ecosystem',
    'hero.title1': 'Your Innovative',
    'hero.title2': 'Crypto Bank',
    'hero.subtitle': 'Staking, DeFi lending, browser mining',
    'hero.subtitle2': 'and own token',
    'hero.stat.users': 'Users',
    'hero.stat.tvl': 'TVL',
    'hero.stat.features': 'Features',
    'features.title': 'FilBank Features',
    'features.subtitle': 'Innovative DeFi tools on Solana',
    'feature.staking.title': '$FILB Staking',
    'feature.staking.desc': 'Up to 25% APY on $FILB token. Automatic compounding, daily payouts.',
    'feature.lending.title': 'DeFi Lending',
    'feature.lending.desc': 'Instant loans backed by $FILB and SOL. Smart contracts only, no intermediaries.',
    'feature.invest.title': 'Auto-Invest',
    'feature.invest.desc': 'Smart portfolios with rebalancing. Copy-trade the best Solana strategies.',
    'feature.mining.title': 'Browser Mining',
    'feature.mining.desc': 'PoW mining of $FILB right in your browser. No ASICs, no GPUs, no investment needed.',
    'card.title': 'FilBank Card',
    'card.subtitle': 'Modern crypto card for payments worldwide',
    'card.feature1.title': 'Virtual & Physical',
    'card.feature1.desc': 'Instant issuance, delivery worldwide',
    'card.feature2.title': 'Auto-Conversion',
    'card.feature2.desc': '$FILB → USDC → Fiat at best rates',
    'card.feature3.title': '5% Cashback in $FILB',
    'card.feature3.desc': 'On every purchase with FilBank card',
    'adv.title': 'Why is FilBank better than a bank?',
    'adv.subtitle': 'Comparison of traditional banks and FilBank on Solana',
    'adv1.title': 'Borderless',
    'adv1.desc': 'Traditional banks: weeks for transfers, SWIFT, fees up to 5%. FilBank: seconds, pennies, no borders.',
    'adv2.title': 'Censorship Resistant',
    'adv2.desc': 'Banks can freeze your account for any reason. FilBank runs on smart contracts — nobody can freeze your funds.',
    'adv3.title': 'Yield',
    'adv3.desc': 'Banks: 0.01% on balance. FilBank: up to 25% APY through staking and DeFi.',
    'adv4.title': 'Own Token $FILB',
    'adv4.desc': 'Banks have no tokens. $FILB is both currency and asset, the key to the ecosystem. Coming to USDT too.',
    'adv5.title': 'Solana — Speed of Light',
    'adv5.desc': '50,000 TPS, $0.0002 per transfer. Banks dream of such efficiency.',
    'adv6.title': 'Automation',
    'adv6.desc': 'Staking, lending, mining — everything works without human intervention. Banks charge for every action.',
    'mining.badge': '⚡ BREAKTHROUGH',
    'mining.title': 'Browser Mining $FILB',
    'mining.desc': 'Proof-of-Work in your browser. No installs, no investments, no limits.',
    'mining.power': 'Power',
    'mining.mined': '$FILB mined',
    'mining.status': 'Status',
    'mining.active': 'Active',
    'mining.stopped': 'Stopped',
    'mining.start': '▶ Start Mining',
    'mining.stop': '⏹ Stop Mining',
    'roadmap.title': '🗺 FilBank Action Map',
    'roadmap.subtitle': 'Ecosystem development plan for 2026',
    'roadmap1.title': 'Website & Wallet Launch',
    'roadmap1.desc': 'Phantom connection, SOL balance display',
    'roadmap2.title': '$FILB Token on Pump.fun',
    'roadmap2.desc': 'SPL token with liquidity and trading on Pump.fun',
    'roadmap3.title': 'Raydium Listing + Staking',
    'roadmap3.desc': 'DEX listing and smart contract with SOL/USDC yield',
    'roadmap4.title': 'DeFi Lending + $FILB/USDT',
    'roadmap4.desc': 'Lending launch and second $FILB token on USDT',
    'roadmap5.title': 'Browser Mining + Cards',
    'roadmap5.desc': 'PoW mining in browser and physical FilBank card issuance',
    'footer.desc': 'Decentralized crypto bank on Solana',
    'profile.title': 'Profile',
    'profile.balance': 'Balance',
    'profile.filb': '$FILB',
    'profile.username': 'Username',
    'profile.save': 'Save',
    'profile.saved': 'Saved',
    'profile.no': 'No name',
    'profile.logout': 'Logout',
    'profile.edit': 'Edit',
    'profile.save': 'Save',
    'profile.saved': 'Saved',
    'profile.changePass': 'Change password',
    'profile.connectWallet': 'Connect wallet',
    'profile.linkedWallet': 'Wallet linked',
    'profile.noWallet': 'No wallet linked',
    'profile.deposit': 'Deposit',
    'profile.withdraw': 'Withdraw',
    'profile.history': 'Transaction history',
    'profile.noTx': 'No transactions yet',
    'profile.staking': '$FILB Staking',
    'profile.stakingDesc': 'Connect wallet to start staking',
    'auth.register': 'Register',
    'auth.login': 'Login',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm': 'Confirm password',
    'auth.registerBtn': 'Create account',
    'auth.loginBtn': 'Sign in',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.wrongPass': 'Wrong password',
    'auth.userNotFound': 'User not found',
    'auth.emailExists': 'This email is already registered',
    'auth.shortPass': 'Minimum 6 characters',
    'auth.passMismatch': 'Passwords do not match',
    'auth.registered': 'Account created! Welcome!',
    'auth.loggedIn': 'Welcome!',
    'hq.title': 'FilBank Headquarters',
    'hq.subtitle': 'The future of decentralized banking — a holographic skyscraper on Solana',
    'hq.card1.title': 'Architecture',
    'hq.card1.desc': 'A 28-story crystal skyscraper with a holographic facade that reacts to blockchain transactions in real time',
    'hq.card2.title': 'Territory',
    'hq.card2.desc': 'An entire city block: crypto valet parking, botanical garden, helipad for VIP clients',
    'hq.card3.title': 'Energy',
    'hq.card3.desc': 'Private solar farm and mining center powered by Solana Proof-of-Stake renewable energy',
    'hq.card4.title': 'Security',
    'hq.card4.desc': 'Biometric protection, quantum encryption, decentralized underground servers at 50 meters depth',
    'hq.spec.year': 'Opening year',
    'hq.spec.height': 'Height',
    'hq.spec.area': 'Area (m²)',
    'hq.spec.vision': 'Vision scale',
    'launch.title': '$FILB Token Launch',
    'launch.subtitle': 'The $FILB token is preparing for launch. Stay tuned!',
    'launch.soon': 'COMING SOON',
    'launch.dev': 'IN DEVELOPMENT',
    'launch.phase': 'Phase',
    'launch.phase1': 'Community',
    'launch.phase2': 'Listing',
    'launch.phase3': 'Launch',
    'launch.notify': 'Notify me',
    'launch.emailPH': 'Your email',
    'launch.subscribed': 'Subscribed!',
    'launch.days': 'Days',
    'launch.hours': 'Hours',
    'launch.minutes': 'Minutes',
    'launch.seconds': 'Seconds',
    'launch.progress': 'Development progress',
    'launch.progressVal': '47%',
    'footer.brand': 'Next-gen decentralized crypto bank on Solana',
    'footer.product': 'Product',
    'footer.resources': 'Resources',
    'footer.legal': 'Legal',
    'footer.staking': 'Staking',
    'footer.mining': 'Mining',
    'footer.defi': 'DeFi',
    'footer.docs': 'Documentation',
    'footer.github': 'GitHub',
    'footer.blog': 'Blog',
    'footer.careers': 'Careers',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.audit': 'Security Audit',
    'footer.copy': '© 2026 FilBank. All rights reserved.',
    'footer.built': 'Built on Solana',
    'map.title': 'FilBank Worldwide',
    'map.subtitle': 'Users from all around the world are joining',
    'map.total': 'Total users',
    'map.countries': 'Countries',
    'map.online': 'Online',
    'map.reg': 'Registration',
    'map.yourCountry': 'Your country',
    'auth.country': 'Country',
    'support.title': 'Support FilBank',
    'support.subtitle': 'Help us launch $FILB token and grow the ecosystem. Every contribution counts.',
    'support.goal1': 'Hosting & Infrastructure',
    'support.goal2': 'Pump.fun Listing',
    'support.goal3': 'Equipment & Software',
    'support.totalRaised': 'Total Raised',
    'support.note': 'Addresses for donations only. $FILB token not launched yet — beware of scammers.',
    'support.telegram': 'Telegram Channel',
    'support.twitter': 'Twitter/X',
    'support.donateSOL': 'Donate SOL',
    'support.donateUSDT': 'Donate USDT',
    'og.title': 'Become FilBank OG',
    'og.subtitle': 'Connect wallet, repost & join Telegram — get OG status & exclusive rewards.',
    'og.step1': 'Wallet',
    'og.step2': 'Social',
    'og.step3': 'Confirm',
    'og.step1Title': 'Connect Solana Wallet',
    'og.step1Desc': 'A connected wallet is required for OG status and future airdrop.',
    'og.step2Title': 'Complete Social Tasks',
    'og.step2Desc': 'Repost the pinned tweet @FilBankOfficial and join the official Telegram channel.',
    'og.step3Title': 'Confirm Participation',
    'og.step3Desc': 'Review your data and submit for OG status.',
    'og.connectWallet': 'Connect Wallet',
    'og.walletConnected': 'Wallet Connected',
    'og.twitterTask': 'Twitter / X',
    'og.twitterTaskDesc': 'Repost pinned tweet @FilBankOfficial',
    'og.telegramTask': 'Telegram',
    'og.telegramTaskDesc': 'Join official channel @FilBankofficial',
    'og.openTwitter': 'Open Twitter',
    'og.openTelegram': 'Open Telegram',
    'og.twitterHandle': 'Your @ on Twitter',
    'og.telegramUser': 'Your @ on Telegram',
    'og.verify': 'Verify',
    'og.verified': 'Verified',
    'og.enterTwitter': 'Enter Twitter @',
    'og.enterTelegram': 'Enter Telegram @',
    'og.verifyBoth': 'Verify both tasks',
    'og.connectWalletFirst': 'Connect wallet first',
    'og.wallet': 'Wallet',
    'og.twitter': 'Twitter',
    'og.telegram': 'Telegram',
    'og.back': 'Back',
    'og.next': 'Next',
    'og.submit': 'Get OG Status',
    'og.submitting': 'Submitting...',
    'og.successTitle': '🎉 You\'re OG!',
    'og.successDesc': 'Your application is accepted. Wait for token distribution and exclusive perks.',
    'og.reward1': 'OG role in Discord/Telegram',
    'og.reward2': 'Priority $FILB allocation',
    'og.reward3': 'Access to private IDO/presales',
    'og.reward4': 'Exclusive NFTs & merch',
    'og.close': 'Close',
    'og.error': 'Submission error',
    'partners.becomePartner': 'Become a Partner',
    'partners.formDesc': 'Want to feature your project in FilBank ecosystem? Fill the form — we\'ll contact you.',
    'partners.name': 'Project Name',
    'partners.namePH': 'Your project name',
    'partners.contact': 'Contact (Telegram / Email / Twitter)',
    'partners.contactPH': '@username or email',
    'partners.details': 'Offer Details',
    'partners.detailsPH': 'What do you offer? Collab, ads, integration...',
    'partners.submit': 'Submit Request',
    'partners.successTitle': 'Request Sent!',
    'partners.successDesc': 'We\'ll review and contact you within 24 hours.',
    'partners.another': 'Send Another',
    'admin.title': 'Admin Panel',
    'admin.ogParticipants': 'OG Participants',
    'admin.donations': 'Donations',
    'admin.partners': 'Partners',
    'admin.wallet': 'Wallet',
    'admin.twitter': 'Twitter',
    'admin.telegram': 'Telegram',
    'admin.date': 'Date',
    'admin.status': 'Status',
    'admin.rewardClaimed': 'Reward',
    'admin.type': 'Type',
    'admin.amount': 'Amount',
    'admin.txId': 'TX ID',
    'admin.name': 'Name',
    'admin.contact': 'Contact',
    'admin.details': 'Details',
    'admin.search': 'Search...',
    'admin.noData': 'No data',
    'admin.exportCSV': 'Export CSV',
    'admin.prepareAirdrop': 'Prepare for Airdrop',
    'admin.addDonation': 'Record Donation',
    'admin.addOG': 'Add OG',
    'admin.add': 'Add',
    'admin.pinPrompt': 'Enter PIN to access admin panel',
    'faq.title': 'Frequently Asked Questions',
    'og.notYet': 'Not OG yet',
    'og.connectTwitter': 'Connect Twitter',
    'og.connectTelegram': 'Connect Telegram',
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Answers to the most popular questions about FilBank',
    'faq.q1': 'What is FilBank?',
    'faq.a1': 'FilBank is a decentralized crypto bank on the Solana blockchain. We offer staking, DeFi lending, browser mining, and our own $FILB token.',
    'faq.q2': 'When will the $FILB token launch?',
    'faq.a2': 'We are in the development phase. The token will be launched via Pump.fun, followed by DEX listing. Stay tuned for updates on our social media.',
    'faq.q3': 'How to earn with FilBank?',
    'faq.a3': 'You can earn through $FILB token staking (up to 25% APY), DeFi lending (interest from loans), and browser mining directly on the website.',
    'faq.q4': 'Are my funds safe?',
    'faq.a4': 'Yes. FilBank operates on Solana smart contracts. Your funds are always under your control. No one can freeze or take your tokens.',
    'faq.q5': 'How to connect a wallet?',
    'faq.a5': 'Click "Connect wallet" and choose Phantom, Solflare, Backpack or another compatible wallet. On mobile — open the site through the wallet app.',
    'faq.q6': 'Do I need to invest for mining?',
    'faq.a6': 'No. Browser mining is completely free. Just click "Start mining" and $FILB will start flowing to your account.',
    'faq.q7': 'Is FilBank a scam?',
    'faq.a7': 'No. We are a transparent project: open source, public team profile, smart contract audits. We are building a long-term project, not a quick scam.',
    'partners.title': 'Ecosystem',
    'partners.subtitle': 'FilBank integrates with leading Solana projects',
    'wallet.connectBtn': 'Connect via',
    'wallet.mobileHint': 'Open this site in your wallet app',
    'wallet.noWalletTitle': 'Install a wallet',
    'wallet.getPhantom': 'Install Phantom',
    'wallet.getSolflare': 'Install Solflare',
    'wallet.getBackpack': 'Install Backpack',
    'wallet.getLogin': 'Sign in',
  }
}

const LanguageContext = createContext()

function useTranslation() {
  const { lang } = useContext(LanguageContext)
  const t = (key) => translations[lang]?.[key] || translations.en[key] || key
  return { t, lang }
}

function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('filbank-lang') || 'ru')
  const switchLang = (l) => { setLang(l); localStorage.setItem('filbank-lang', l) }
  return (
    <LanguageContext.Provider value={{ lang, setLang: switchLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

function detectWallets() {
  const list = []
  const dedup = new Set()
  const add = (id, name, icon, getter) => {
    try {
      const p = typeof getter === 'function' ? getter() : getter
      if (p && !dedup.has(p)) { dedup.add(p); list.push({ id, name, icon, provider: p }) }
    } catch {}
  }
  add('phantom', 'Phantom', '👻', () => window.phantom?.solana)
  if (window.solflare?.isSolflare) add('solflare', 'Solflare', '🔥', window.solflare)
  if (window.backpack?.isBackpack) add('backpack', 'Backpack', '🎒', window.backpack)
  if (window.glow?.isGlow) add('glow', 'Glow', '✨', window.glow)
  if (window.exodus?.isExodus) add('exodus', 'Exodus', '◆', window.exodus)
  if (window.slope?.isSlope) add('slope', 'Slope', '🦘', window.slope)
  if (window.coin98?.isCoin98) add('coin98', 'Coin98', '🪙', window.coin98)
  if (window.safety?.isSafety) add('safety', 'Safety', '🛡️', window.safety)
  if (window.torus?.isTorus) add('torus', 'Torus', '🔴', window.torus)
  if (list.length === 0 && window.solana) add('solana', 'Solana Wallet', '💎', window.solana)
  return list
}

const IS_MOBILE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
const WALLET_DEEP_LINKS = [
  { id: 'phantom', name: 'Phantom', icon: '👻', color: '#AB9FF2', installUrl: 'https://phantom.app', scheme: 'https://phantom.app/ul/' },
  { id: 'solflare', name: 'Solflare', icon: '🔥', color: '#FF9338', installUrl: 'https://solflare.com', scheme: 'https://solflare.com/ul/' },
  { id: 'backpack', name: 'Backpack', icon: '🎒', color: '#F7931A', installUrl: 'https://backpack.app', scheme: 'backpack://' },
  { id: 'glow', name: 'Glow', icon: '✨', color: '#14f195', installUrl: 'https://glow.app', scheme: 'glow://' },
  { id: 'exodus', name: 'Exodus', icon: '◆', color: '#9945ff', installUrl: 'https://exodus.com', scheme: 'exodus://' },
  { id: 'slope', name: 'Slope', icon: '🦘', color: '#FF6B35', installUrl: 'https://slope.finance', scheme: 'slope://' },
  { id: 'coin98', name: 'Coin98', icon: '🪙', color: '#C9293C', installUrl: 'https://coin98.com', scheme: 'coin98://' },
  { id: 'torus', name: 'Torus', icon: '🔴', color: '#FF4B4B', installUrl: 'https://torus.network', scheme: 'torus://' },
]

function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const particles = []
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    for (let i = 0; i < 80; i++) particles.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5, speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5, opacity: Math.random() * 0.5 + 0.1,
    })
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.speedX; p.y += p.speedY
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(153, 69, 255, ${p.opacity})`; ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(153, 69, 255, ${0.08 * (1 - dist / 150)})`; ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="particles" />
}

function FloatingCoin() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas.getContext('2d')
    let animId; canvas.width = 400; canvas.height = 400
    let angle = 0, floatY = 0, floatDir = 1
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2, cy = canvas.height / 2 - 20
      angle += 0.015; floatY += 0.02 * floatDir
      if (Math.abs(floatY) > 8) floatDir *= -1
      ctx.save(); ctx.translate(cx, cy + floatY); ctx.rotate(angle * 0.3)
      ctx.beginPath(); ctx.ellipse(0, 0, 170, 40, 0, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(20, 241, 149, ${0.08 + Math.sin(angle) * 0.03})`; ctx.lineWidth = 1; ctx.stroke()
      ctx.restore()
      ctx.save(); ctx.translate(cx, cy + floatY); ctx.rotate(-angle * 0.4 + 1)
      ctx.beginPath(); ctx.ellipse(0, 0, 160, 35, 0, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(153, 69, 255, ${0.08 + Math.cos(angle) * 0.03})`; ctx.lineWidth = 1; ctx.stroke()
      ctx.restore()
      const og = ctx.createRadialGradient(cx, cy + floatY, 30, cx, cy + floatY, 120)
      og.addColorStop(0, 'rgba(153, 69, 255, 0.12)'); og.addColorStop(0.5, 'rgba(20, 241, 149, 0.05)'); og.addColorStop(1, 'transparent')
      ctx.fillStyle = og; ctx.fillRect(cx - 120, cy + floatY - 120, 240, 240)
      ctx.save(); ctx.translate(cx, cy + floatY); ctx.scale(1 + Math.sin(angle) * 0.03, 1 - Math.sin(angle) * 0.03)
      const sh = ctx.createRadialGradient(5, 5, 10, 5, 5, 90)
      sh.addColorStop(0, 'rgba(0,0,0,0.2)'); sh.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(5, 5, 85, 0, Math.PI * 2); ctx.fillStyle = sh; ctx.fill()
      ctx.beginPath(); ctx.arc(0, 0, 85, 0, Math.PI * 2)
      const rg = ctx.createLinearGradient(-85, -85, 85, 85)
      rg.addColorStop(0, '#7c3aed'); rg.addColorStop(0.5, '#9945ff'); rg.addColorStop(1, '#6d28d9')
      ctx.fillStyle = rg; ctx.fill()
      ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2)
      const ig = ctx.createRadialGradient(-10, -10, 5, 0, 0, 70)
      ig.addColorStop(0, '#a855f7'); ig.addColorStop(0.5, '#7c3aed'); ig.addColorStop(1, '#5b21b6')
      ctx.fillStyle = ig; ctx.fill()
      ctx.beginPath(); ctx.arc(-15, -15, 40, 0, Math.PI * 2)
      const sg = ctx.createRadialGradient(-15, -15, 0, -15, -15, 40)
      sg.addColorStop(0, 'rgba(255,255,255,0.15)'); sg.addColorStop(1, 'transparent')
      ctx.fillStyle = sg; ctx.fill()
      ctx.beginPath(); ctx.arc(0, 0, 77, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(20, 241, 149, 0.3)'; ctx.lineWidth = 1.5; ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, 63, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(20, 241, 149, 0.15)'; ctx.lineWidth = 1; ctx.stroke()
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2
        ctx.beginPath(); ctx.arc(Math.cos(a) * 73, Math.sin(a) * 73, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(20, 241, 149, ${0.3 + Math.sin(a + angle) * 0.1})`; ctx.fill()
      }
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = 'bold 22px Inter, sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$FILB', 0, -8)
      ctx.fillStyle = 'rgba(20, 241, 149, 0.7)'; ctx.font = '12px Inter, sans-serif'
      ctx.fillText('Solana', 0, 22)
      ctx.restore()
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + angle * (0.5 + i * 0.1)
        const r = 110 + Math.sin(angle * 2 + i) * 15
        ctx.beginPath(); ctx.arc(cx + Math.cos(a) * Math.sin(angle * 0.3 + i * 0.1) * r, cy + floatY + Math.sin(a) * Math.sin(angle * 0.3 + i * 0.1) * r * 0.3, 1.5 + Math.sin(angle + i) * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(20, 241, 149, ${0.3 + Math.sin(a + angle) * 0.2})`; ctx.fill()
      }
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animId)
  }, [])
  return <canvas ref={canvasRef} className="coin-canvas" width={400} height={400} />
}

function BankCard() {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    let rafId; const target = { x: 0, y: 0 }; const current = { x: 0, y: 0 }
    const handleMouse = (e) => {
      const rect = card.parentElement.getBoundingClientRect()
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2
      target.x = (e.clientX - cx) / rect.width * 2; target.y = (e.clientY - cy) / rect.height * 2
    }
    const animate = () => {
      current.x += (target.x - current.x) * 0.05; current.y += (target.y - current.y) * 0.05
      setTilt({ x: current.y * 8, y: current.x * 8 }); rafId = requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', handleMouse); rafId = requestAnimationFrame(animate)
    return () => { window.removeEventListener('mousemove', handleMouse); cancelAnimationFrame(rafId) }
  }, [])
  return (
    <div className="card-stand-wrapper">
      <div className="stand-light-cone"></div>
      <div className="card-stand">
        <div className="stand-pillar"></div>
        <div className="stand-body"><div className="stand-glow-line"></div></div>
        <div className="stand-base"></div>
      </div>
      <div className="bank-card" ref={cardRef} style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <div className="card-glow-top"></div>
        <div className="card-bg-pattern"></div>
        <div className="card-shimmer"></div>
        <div className="card-top-row">
          <div className="card-chip"><div className="chip-lines"><span></span><span></span><span></span></div></div>
          <div className="card-contactless">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 12c0-3.3 2.7-6 6-6M6 12c0-2.2 1.8-4 4-4M10 12c0-1.1.9-2 2-2s2 .9 2 2"/>
            </svg>
          </div>
          <div className="card-brand">FilBank</div>
        </div>
        <div className="card-number">4532 7841 9023 5671</div>
        <div className="card-info-row">
          <div className="card-info-item"><span className="card-info-label">VALID THRU</span><span className="card-info-value">06/28</span></div>
          <div className="card-info-item"><span className="card-info-label">CVV</span><span className="card-info-value">•••</span></div>
        </div>
        <div className="card-ecosystem">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
          <span>Wallet</span><span className="eco-dot">•</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          <span>DeFi</span><span className="eco-dot">•</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span>Mine</span>
        </div>
        <div className="card-network">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="rgba(20,241,149,0.25)" strokeWidth="1.5"/>
            <circle cx="18" cy="18" r="8" stroke="rgba(20,241,149,0.25)" strokeWidth="1.5"/>
            <circle cx="18" cy="18" r="3" fill="#14f195"/>
          </svg>
        </div>
        <div className="card-footer">
          <span className="card-type">CRYPTO BANK</span>
          <span className="card-coin">$FILB</span>
        </div>
      </div>
    </div>
  )
}

function MiningSection() {
  const { t } = useTranslation()
  const [miningPower, setMiningPower] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [mined, setMined] = useState(0)
  const minerRef = useRef(null)
  useEffect(() => {
    if (!isRunning) return
    minerRef.current = setInterval(() => {
      setMiningPower((p) => p >= 100 ? 0 : p + Math.random() * 3)
      setMined((m) => { const v = m + Math.random() * 0.0001; localStorage.setItem('filbank-mined', v.toFixed(6)); return v })
    }, 200)
    return () => clearInterval(minerRef.current)
  }, [isRunning])
  const toggleMiner = () => setIsRunning(!isRunning)
  const bars = []
  for (let i = 0; i < 30; i++) {
    bars.push(<div key={i} className={`mine-bar ${isRunning && i < (miningPower / 100) * 30 ? 'active' : ''}`}
      style={{ height: `${Math.random() * 50 + 15}px`, animationDelay: `${i * 0.05}s`, animationPlayState: isRunning ? 'running' : 'paused' }} />)
  }
  return (
    <section className="mining-section" id="mining">
      <div className="mining-bg"><div className="mining-grid"></div><div className="mining-pulse"></div></div>
      <div className="mining-content">
        <div className="mining-header">
          <span className="mining-badge">{t('mining.badge')}</span>
          <h2>{t('mining.title')}</h2>
          <p>{t('mining.desc')}</p>
        </div>
        <div className="mining-visual">
          <div className="mining-core"><div className="core-ring"><div className="core-center"><span className="core-icon">⛏️</span></div></div></div>
          <div className="mine-bars-container">{bars}</div>
        </div>
        <div className="mining-stats">
          <div className="mine-stat"><span className="mine-stat-value">{miningPower.toFixed(1)}%</span><span className="mine-stat-label">{t('mining.power')}</span></div>
          <div className="mine-stat"><span className="mine-stat-value">{mined.toFixed(4)}</span><span className="mine-stat-label">{t('mining.mined')}</span></div>
          <div className="mine-stat"><span className="mine-stat-value">{isRunning ? t('mining.active') : t('mining.stopped')}</span><span className="mine-stat-label">{t('mining.status')}</span></div>
        </div>
        <button className={`mine-btn ${isRunning ? 'stop' : 'start'}`} onClick={toggleMiner}>
          {isRunning ? t('mining.stop') : t('mining.start')}
        </button>
      </div>
    </section>
  )
}

const WALLET_LIST = [
  { id: 'phantom', name: 'Phantom', icon: '👻', url: 'https://phantom.app' },
  { id: 'solflare', name: 'Solflare', icon: '🔥', url: 'https://solflare.com' },
  { id: 'backpack', name: 'Backpack', icon: '🎒', url: 'https://backpack.app' },
  { id: 'glow', name: 'Glow', icon: '✨', url: 'https://glow.app' },
  { id: 'exodus', name: 'Exodus', icon: '◆', url: 'https://exodus.com' },
]

function getWalletProvider(id) {
  try {
    if (id === 'phantom') return window.phantom?.solana || null
    if (id === 'solflare') return window.solflare || null
    if (id === 'backpack') return window.backpack || null
    if (id === 'glow') return window.glow || null
    if (id === 'exodus') return window.exodus || null
    return null
  } catch { return null }
}

function DonationVault({ t, donations }) {
  const canvasRef = useRef(null)
  const [rain, setRain] = useState([])
  const [floaters, setFloaters] = useState([])
  const prevLen = useRef(0)
  const [hoveredAddress, setHoveredAddress] = useState(null)
  const [hoveredText, setHoveredText] = useState('')

  // Coin rain when new donation comes
  useEffect(() => {
    if (donations.length > prevLen.current) {
      const newD = donations[donations.length - 1]
      const coins = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        delay: i * 0.1,
        size: 20 + Math.random() * 15,
        drift: (Math.random() - 0.5) * 40
      }))
      setRain(prev => [...prev, ...coins])
      setFloaters(prev => [...prev, {
        id: Date.now(),
        name: newD?.twitter || newD?.type || 'Anonymous',
        amount: newD?.amount || '',
        x: 30 + Math.random() * 40,
      }])
      setTimeout(() => {
        setRain(prev => prev.filter(c => Date.now() - c.id < 3000))
        setFloaters(prev => prev.filter(f => Date.now() - f.id < 4000))
      }, 4000)
    }
    prevLen.current = donations.length
  }, [donations.length])

  // Canvas particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const particles = []
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5, speedY: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1, hue: 260 + Math.random() * 40
      })
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.y += p.speedY
        if (p.y > canvas.height) { p.y = -5; p.x = Math.random() * canvas.width }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.opacity})`
        ctx.fill()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animId)
  }, [])

  const total = donations.reduce((s, d) => s + parseFloat(d.amount), 0).toFixed(4)

  const copyAddr = (addr, label) => {
    navigator.clipboard.writeText(addr)
    setHoveredText(label)
    setHoveredAddress(addr)
    setTimeout(() => setHoveredAddress(null), 2000)
  }

  return (
    <section id="support" className="partners-section" style={{borderTop:'1px solid var(--border)',paddingTop:'60px',position:'relative',overflow:'hidden'}}>
      <canvas ref={canvasRef} className="particles" style={{opacity:0.3}} />
      <div className="section-header" style={{position:'relative',zIndex:1}}>
        <div className="donate-badge">💎</div>
        <h2>{t('support.title')}</h2>
        <p>{t('support.subtitle')}</p>
      </div>

      {/* 3D Sphere */}
      <div style={{display:'flex',justifyContent:'center',margin:'0 auto 40px',position:'relative',zIndex:1}}>
        <div className="sphere-3d">
          <div className="sphere-globe">
            <div className="sphere-glow-inner"></div>
            <div className="sphere-grid"></div>
            <div className="sphere-ring sphere-ring-1"></div>
            <div className="sphere-ring sphere-ring-2"></div>
            <div className="sphere-ring sphere-ring-3"></div>
            <div className="sphere-center-icon">🪙</div>
            {rain.map(c => (
              <div key={c.id} className="coin-rain"
                style={{
                  left: `${c.x}%`,
                  fontSize: c.size + 'px',
                  animationDelay: c.delay + 's',
                  '--drift': c.drift + 'px'
                }}
              >🪙</div>
            ))}
            {floaters.map(f => (
              <div key={f.id} className="donor-floater">
                <span className="floater-name">{f.name}</span>
                <span className="floater-amount">+{f.amount} SOL</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Total raised */}
      <div style={{textAlign:'center',marginBottom:'30px',position:'relative',zIndex:1}}>
        <div className="vault-total-label">{t('support.totalRaised')}</div>
        <div className="vault-total-amount">{total} SOL</div>
      </div>

      {/* Goals */}
      <div style={{maxWidth:400,margin:'0 auto 30px',position:'relative',zIndex:1}}>
        <div className="support-goal" style={{marginBottom:8}}>
          <span className="support-goal-label">{t('support.goal2')}</span>
          <div className="support-goal-progress">
            <div className="support-progress-bar"><div className="support-progress-fill" style={{width:'5%'}}></div></div>
            <span className="support-goal-amount">5%</span>
          </div>
        </div>
        <div className="support-goal">
          <span className="support-goal-label">{t('support.goal3')}</span>
          <div className="support-goal-progress">
            <div className="support-progress-bar"><div className="support-progress-fill" style={{width:'3%'}}></div></div>
            <span className="support-goal-amount">3%</span>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="support-addresses" style={{maxWidth:480,margin:'0 auto',position:'relative',zIndex:1}}>
        <div className="support-address">
          <div className="support-address-header">
            <span className="support-coin">◎ SOL</span>
            <span className="support-network">Solana</span>
          </div>
          <div className="support-address-row">
            <code className="support-address-code">7xK4f2vL9mN3pQ8rT5wY7uI1oP6aS9dF</code>
            <button className="support-copy-btn" onClick={() => copyAddr('7xK4f2vL9mN3pQ8rT5wY7uI1oP6aS9dF','SOL')}>
              {hoveredAddress === '7xK4f2vL9mN3pQ8rT5wY7uI1oP6aS9dF' ? '✓' : '📋'}
            </button>
          </div>
          <div style={{display:'flex',gap:8,marginTop:10}}>
            <button className="support-donate-btn btn-primary" onClick={() => { window.open('https://phantom.app/ul/v1/transfer?recipient=7xK4f2vL9mN3pQ8rT5wY7uI1oP6aS9dF&amount=0.1', '_blank') }} style={{flex:1,fontSize:13,padding:'10px 16px'}}>
              👻 Phantom
            </button>
            <button className="support-donate-btn btn-primary" onClick={() => { window.open('https://solflare.com/ul/transfer?recipient=7xK4f2vL9mN3pQ8rT5wY7uI1oP6aS9dF&amount=0.1', '_blank') }} style={{flex:1,fontSize:13,padding:'10px 16px',background:'linear-gradient(135deg,#FF9338,#e67e22)'}}>
              🔥 Solflare
            </button>
          </div>
        </div>
        <div className="support-address">
          <div className="support-address-header">
            <span className="support-coin">💵 USDT</span>
            <span className="support-network">SPL / TRC20 / ERC20</span>
          </div>
          <div className="support-address-row">
            <code className="support-address-code">ETkmY37T9tKmwNzxLrNrLh6GdphDEDAB6qWfdywEGf8p</code>
            <button className="support-copy-btn" onClick={() => copyAddr('ETkmY37T9tKmwNzxLrNrLh6GdphDEDAB6qWfdywEGf8p','USDT')}>
              {hoveredAddress === 'ETkmY37T9tKmwNzxLrNrLh6GdphDEDAB6qWfdywEGf8p' ? '✓' : '📋'}
            </button>
          </div>
        </div>
      </div>
      <div className="support-note" style={{maxWidth:480,margin:'16px auto 0',position:'relative',zIndex:1}}>{t('support.note')}</div>
    </section>
  )
}

function SupportModal({ isOpen, onClose, t, donations, onDonate }) {
  const [copied, setCopied] = useState(null)
  const [donating, setDonating] = useState(null)
  
  const copyAddress = (address, label) => {
    navigator.clipboard.writeText(address)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDonate = (type) => {
    setDonating(type)
    setTimeout(() => {
      const amount = type === 'SOL' ? '0.1' : '10'
      onDonate({ type, amount, txId: 'manual_' + Date.now(), timestamp: Date.now() })
      setDonating(null)
    }, 500)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal support-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="support-badge">💎</div>
        <h2 className="support-title">{t('support.title')}</h2>
        <p className="support-subtitle">{t('support.subtitle')}</p>
        
        <div className="support-goals">
          <div className="support-goal">
            <span className="support-goal-label">{t('support.goal1')}</span>
            <div className="support-goal-progress">
              <div className="support-progress-bar"><div className="support-progress-fill" style={{width:'12%'}}></div></div>
              <span className="support-goal-amount">12%</span>
            </div>
          </div>
          <div className="support-goal">
            <span className="support-goal-label">{t('support.goal2')}</span>
            <div className="support-goal-progress">
              <div className="support-progress-bar"><div className="support-progress-fill" style={{width:'5%'}}></div></div>
              <span className="support-goal-amount">5%</span>
            </div>
          </div>
          <div className="support-goal">
            <span className="support-goal-label">{t('support.goal3')}</span>
            <div className="support-goal-progress">
              <div className="support-progress-bar"><div className="support-progress-fill" style={{width:'3%'}}></div></div>
              <span className="support-goal-amount">3%</span>
            </div>
          </div>
          <div className="support-goal" style={{borderTop:'1px solid var(--border)',paddingTop:'12px',marginTop:'4px'}}>
            <span className="support-goal-label">{t('support.totalRaised')}</span>
            <span className="support-goal-amount">{donations.reduce((s, d) => s + parseFloat(d.amount), 0).toFixed(4)} SOL</span>
          </div>
        </div>

        <div className="support-addresses">
          <div className="support-address">
            <div className="support-address-header">
              <span className="support-coin">◎ SOL</span>
              <span className="support-network">Solana</span>
            </div>
            <div className="support-address-row">
              <code className="support-address-code">7xK4f2vL9mN3pQ8rT5wY7uI1oP6aS9dF</code>
              <button className="support-copy-btn" onClick={() => copyAddress('7xK4f2vL9mN3pQ8rT5wY7uI1oP6aS9dF', 'SOL')}>
                {copied === 'SOL' ? '✓' : '📋'}
              </button>
            </div>
            <button className="btn-primary support-donate-btn" onClick={() => handleDonate('SOL')} disabled={donating === 'SOL'}>
              {donating === 'SOL' ? '⏳' : '💸'} {t('support.donateSOL')}
            </button>
          </div>
          
          <div className="support-address">
            <div className="support-address-header">
              <span className="support-coin">💵 USDT</span>
              <span className="support-network">SPL / TRC20 / ERC20</span>
            </div>
            <div className="support-address-row">
              <code className="support-address-code">ETkmY37T9tKmwNzxLrNrLh6GdphDEDAB6qWfdywEGf8p</code>
              <button className="support-copy-btn" onClick={() => copyAddress('ETkmY37T9tKmwNzxLrNrLh6GdphDEDAB6qWfdywEGf8p', 'USDT')}>
                {copied === 'USDT' ? '✓' : '📋'}
              </button>
            </div>
            <button className="btn-primary support-donate-btn" onClick={() => handleDonate('USDT')} disabled={donating === 'USDT'}>
              {donating === 'USDT' ? '⏳' : '💸'} {t('support.donateUSDT')}
            </button>
          </div>
        </div>

        <div className="support-note">
          {t('support.note')}
        </div>

        <div className="support-social">
          <a href="https://t.me/FilBankofficial" target="_blank" rel="noopener" className="support-social-btn telegram">
            📱 {t('support.telegram')}
          </a>
          <a href="https://twitter.com/FilBankOfficial" target="_blank" rel="noopener" className="support-social-btn twitter">
            🐦 {t('support.twitter')}
          </a>
        </div>
      </div>
    </div>
  )
}

function OGModal({ isOpen, onClose, t, publicKey, onConnectWallet, connectedWallet }) {
  const [step, setStep] = useState(1)
  const [twitterHandle, setTwitterHandle] = useState('')
  const [telegramUser, setTelegramUser] = useState('')
  const [twitterVerified, setTwitterVerified] = useState(false)
  const [telegramVerified, setTelegramVerified] = useState(false)
  const [walletConnected, setWalletConnected] = useState(!!publicKey)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setWalletConnected(!!publicKey) }, [publicKey])
  useEffect(() => { if (!isOpen) { setStep(1); setTwitterVerified(false); setTelegramVerified(false); setSuccess(false); setError('') } }, [isOpen])

  const openTwitterIntent = () => {
    const tweetUrl = 'https://twitter.com/FilBankOfficial/status/1'
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Я поддерживаю @FilBankOfficial 💎 #FilBank #Solana #DeFi')}&url=${encodeURIComponent('https://filbank.io')}&related=FilBankOfficial`
    window.open(intentUrl, '_blank', 'width=550,height=420')
  }

  const openTelegram = () => {
    window.open('https://t.me/FilBankofficial', '_blank')
  }

  const verifyTwitter = () => {
    if (!twitterHandle.trim()) {
      setError(t('og.enterTwitter'))
      return
    }
    setTwitterVerified(true)
    setError('')
  }

  const verifyTelegram = () => {
    if (!telegramUser.trim()) {
      setError(t('og.enterTelegram'))
      return
    }
    setTelegramVerified(true)
    setError('')
  }

  const handleSubmit = async () => {
    if (!walletConnected) {
      setError(t('og.connectWalletFirst'))
      return
    }
    if (!twitterVerified || !telegramVerified) {
      setError(t('og.verifyBoth'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const addrStr = publicKey?.toBase58?.() || publicKey || ''
      const participant = {
        wallet: addrStr,
        twitter: twitterHandle.replace('@', ''),
        telegram: telegramUser.replace('@', ''),
        timestamp: Date.now(),
        status: 'verified',
        rewardClaimed: false
      }

      // This will be handled by parent component via callback
      window.dispatchEvent(new CustomEvent('og-participant-added', { detail: participant }))
      
      setSuccess(true)
      setLoading(false)
    } catch (e) {
      setError(t('og.error'))
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal og-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        {success ? (
          <div className="og-success">
            <div className="og-success-badge">🏆</div>
            <h2 className="og-success-title">{t('og.successTitle')}</h2>
            <p className="og-success-desc">{t('og.successDesc')}</p>
            <div className="og-rewards-list">
              <div className="og-reward-item">✅ {t('og.reward1')}</div>
              <div className="og-reward-item">🎁 {t('og.reward2')}</div>
              <div className="og-reward-item">💎 {t('og.reward3')}</div>
              <div className="og-reward-item">🚀 {t('og.reward4')}</div>
            </div>
            <button className="btn-primary og-close-btn" onClick={onClose}>{t('og.close')}</button>
          </div>
        ) : (
          <>
            <div className="og-progress-steps">
              <div className={`og-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
                <span className="og-step-num">1</span>
                <span className="og-step-label">{t('og.step1')}</span>
              </div>
              <div className="og-step-line"></div>
              <div className={`og-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
                <span className="og-step-num">2</span>
                <span className="og-step-label">{t('og.step2')}</span>
              </div>
              <div className="og-step-line"></div>
              <div className={`og-step ${step >= 3 ? 'active' : ''}`}>
                <span className="og-step-num">3</span>
                <span className="og-step-label">{t('og.step3')}</span>
              </div>
            </div>

            {step === 1 && (
              <div className="og-step-content">
                <h3>{t('og.step1Title')}</h3>
                <p className="og-step-desc">{t('og.step1Desc')}</p>
                <div className="og-wallet-status">
                  {walletConnected ? (
                    <div className="og-wallet-connected">
                      <span className="og-wallet-icon">👻</span>
                      <span>{t('og.walletConnected')}</span>
                      <span className="og-wallet-addr">{connectedWallet || (publicKey?.toBase58?.() || publicKey || '').slice(0, 8)}...</span>
                    </div>
                  ) : (
                    <button className="btn-primary og-wallet-btn" onClick={() => { onClose(); onConnectWallet() }}>
                      {t('og.connectWallet')}
                    </button>
                  )}
                </div>
                <div className="og-step-actions">
                  <button className="btn-primary" onClick={() => setStep(2)} disabled={!walletConnected}>
                    {t('og.next')}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="og-step-content">
                <h3>{t('og.step2Title')}</h3>
                <p className="og-step-desc">{t('og.step2Desc')}</p>
                <div className="og-social-task">
                  <div className="og-task-card">
                    <div className="og-task-icon">🐦</div>
                    <div className="og-task-info">
                      <div className="og-task-title">{t('og.twitterTask')}</div>
                      <div className="og-task-desc">{t('og.twitterTaskDesc')}</div>
                    </div>
                    {twitterVerified ? (
                      <span className="og-task-status done">✓ {t('og.verified')}</span>
                    ) : (
                      <button className="btn-primary og-task-btn" onClick={openTwitterIntent}>
                        {t('og.openTwitter')}
                      </button>
                    )}
                  </div>
                  {!twitterVerified && (
                    <div className="og-input-group">
                      <label>{t('og.twitterHandle')}</label>
                      <input 
                        type="text" 
                        placeholder="@yourhandle" 
                        value={twitterHandle}
                        onChange={(e) => setTwitterHandle(e.target.value)}
                        className="og-input"
                      />
                      <button className="btn-secondary" onClick={verifyTwitter}>{t('og.verify')}</button>
                    </div>
                  )}
                </div>
                <div className="og-social-task">
                  <div className="og-task-card">
                    <div className="og-task-icon">📱</div>
                    <div className="og-task-info">
                      <div className="og-task-title">{t('og.telegramTask')}</div>
                      <div className="og-task-desc">{t('og.telegramTaskDesc')}</div>
                    </div>
                    {telegramVerified ? (
                      <span className="og-task-status done">✓ {t('og.verified')}</span>
                    ) : (
                      <button className="btn-primary og-task-btn" onClick={openTelegram}>
                        {t('og.openTelegram')}
                      </button>
                    )}
                  </div>
                  {!telegramVerified && (
                    <div className="og-input-group">
                      <label>{t('og.telegramUser')}</label>
                      <input 
                        type="text" 
                        placeholder="@yourusername" 
                        value={telegramUser}
                        onChange={(e) => setTelegramUser(e.target.value)}
                        className="og-input"
                      />
                      <button className="btn-secondary" onClick={verifyTelegram}>{t('og.verify')}</button>
                    </div>
                  )}
                </div>
                <div className="og-step-actions">
                  <button className="btn-secondary" onClick={() => setStep(1)}>{t('og.back')}</button>
                  <button className="btn-primary" onClick={() => setStep(3)} disabled={!twitterVerified || !telegramVerified}>
                    {t('og.next')}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="og-step-content">
                <h3>{t('og.step3Title')}</h3>
                <p className="og-step-desc">{t('og.step3Desc')}</p>
                <div className="og-summary">
                  <div className="og-summary-row">
                    <span>{t('og.wallet')}:</span>
                    <span>{(publicKey?.toBase58?.() || publicKey || '').slice(0, 8)}...{(publicKey?.toBase58?.() || publicKey || '').slice(-6)}</span>
                  </div>
                  <div className="og-summary-row">
                    <span>{t('og.twitter')}:</span>
                    <span>@{twitterHandle}</span>
                  </div>
                  <div className="og-summary-row">
                    <span>{t('og.telegram')}:</span>
                    <span>@{telegramUser}</span>
                  </div>
                </div>
                {error && <div className="og-error">{error}</div>}
                <div className="og-step-actions">
                  <button className="btn-secondary" onClick={() => setStep(2)}>{t('og.back')}</button>
                  <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? t('og.submitting') : t('og.submit')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function AdminPanel({ isOpen, onClose, t, ogParticipants, supportDonations, partnerRequests, onAddDonation, onAddOG }) {
  const [tab, setTab] = useState('og')
  const [search, setSearch] = useState('')
  const [showAddDonation, setShowAddDonation] = useState(false)
  const [showAddOG, setShowAddOG] = useState(false)
  const [donateType, setDonateType] = useState('SOL')
  const [donateAmount, setDonateAmount] = useState('')
  const [donateTx, setDonateTx] = useState('')
  const [ogWallet, setOgWallet] = useState('')
  const [ogTwitter, setOgTwitter] = useState('')
  const [ogTelegram, setOgTelegram] = useState('')

  const exportCSV = (data, filename) => {
    if (!data.length) return
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(',')).join('\n')
    const csv = headers + '\n' + rows
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredOG = ogParticipants.filter(p => 
    p.wallet.toLowerCase().includes(search.toLowerCase()) ||
    p.twitter.toLowerCase().includes(search.toLowerCase()) ||
    p.telegram.toLowerCase().includes(search.toLowerCase())
  )

  const filteredDonations = supportDonations.filter(d =>
    d.txId.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  )

  const filteredPartners = partnerRequests.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.contact.toLowerCase().includes(search.toLowerCase()) ||
    p.details.toLowerCase().includes(search.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal admin-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <h2>🔐 {t('admin.title')}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-tabs">
          <button className={tab === 'og' ? 'active' : ''} onClick={() => setTab('og')}>
            {t('admin.ogParticipants')} ({ogParticipants.length})
          </button>
          <button className={tab === 'donations' ? 'active' : ''} onClick={() => setTab('donations')}>
            {t('admin.donations')} ({supportDonations.length})
          </button>
          <button className={tab === 'partners' ? 'active' : ''} onClick={() => setTab('partners')}>
            {t('admin.partners')} ({partnerRequests.length})
          </button>
        </div>
        <div className="admin-search">
          <input type="text" placeholder={t('admin.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="admin-content">
          {tab === 'og' && (
            <div className="admin-table-wrap">
              {!showAddOG ? (
                <button className="btn-secondary" style={{marginBottom:12}} onClick={() => setShowAddOG(true)}>
                  ➕ {t('admin.addOG')}
                </button>
              ) : (
                <div className="admin-add-form">
                  <input value={ogWallet} onChange={e => setOgWallet(e.target.value)} placeholder="Wallet address" />
                  <input value={ogTwitter} onChange={e => setOgTwitter(e.target.value)} placeholder="@twitter" />
                  <input value={ogTelegram} onChange={e => setOgTelegram(e.target.value)} placeholder="@telegram" />
                  <div className="admin-add-actions">
                    <button className="btn-primary" onClick={() => { if (ogWallet) { onAddOG({ wallet: ogWallet, twitter: ogTwitter, telegram: ogTelegram, timestamp: Date.now(), status: 'verified', rewardClaimed: false }); setOgWallet(''); setOgTwitter(''); setOgTelegram(''); setShowAddOG(false) } }}>✓ {t('admin.add')}</button>
                    <button className="btn-secondary" onClick={() => setShowAddOG(false)}>✕</button>
                  </div>
                </div>
              )}
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.wallet')}</th>
                    <th>{t('admin.twitter')}</th>
                    <th>{t('admin.telegram')}</th>
                    <th>{t('admin.date')}</th>
                    <th>{t('admin.status')}</th>
                    <th>{t('admin.rewardClaimed')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOG.map((p, i) => (
                    <tr key={i}>
                      <td><code>{p.wallet.slice(0, 8)}...{p.wallet.slice(-6)}</code></td>
                      <td>@{p.twitter}</td>
                      <td>@{p.telegram}</td>
                      <td>{new Date(p.timestamp).toLocaleString()}</td>
                      <td><span className={`admin-status ${p.status}`}>{p.status}</span></td>
                      <td>{p.rewardClaimed ? '✅' : '⏳'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOG.length === 0 && <p className="admin-empty">{t('admin.noData')}</p>}
              <div className="admin-actions">
                <button className="btn-secondary" onClick={() => exportCSV(filteredOG, 'og-participants.csv')}>
                  📥 {t('admin.exportCSV')}
                </button>
                <button className="btn-primary" onClick={() => exportCSV(filteredOG.map(p => ({...p, rewardClaimed: true})), 'airdrop-list.csv')}>
                  🚀 {t('admin.prepareAirdrop')}
                </button>
              </div>
            </div>
          )}
          {tab === 'donations' && (
            <div className="admin-table-wrap">
              {!showAddDonation ? (
                <button className="btn-secondary" style={{marginBottom:12}} onClick={() => setShowAddDonation(true)}>
                  ➕ {t('admin.addDonation')}
                </button>
              ) : (
                <div className="admin-add-form">
                  <select value={donateType} onChange={e => setDonateType(e.target.value)}>
                    <option value="SOL">SOL</option>
                    <option value="USDT">USDT</option>
                  </select>
                  <input value={donateAmount} onChange={e => setDonateAmount(e.target.value)} placeholder="Amount" type="number" step="any" />
                  <input value={donateTx} onChange={e => setDonateTx(e.target.value)} placeholder="TX ID" />
                  <div className="admin-add-actions">
                    <button className="btn-primary" onClick={() => { if (donateAmount) { onAddDonation({ type: donateType, amount: donateAmount, txId: donateTx || 'manual_'+Date.now(), timestamp: Date.now() }); setDonateAmount(''); setDonateTx(''); setShowAddDonation(false) } }}>✓ {t('admin.add')}</button>
                    <button className="btn-secondary" onClick={() => setShowAddDonation(false)}>✕</button>
                  </div>
                </div>
              )}
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.type')}</th>
                    <th>{t('admin.amount')}</th>
                    <th>{t('admin.txId')}</th>
                    <th>{t('admin.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((d, i) => (
                    <tr key={i}>
                      <td><span className={`admin-coin ${d.type.toLowerCase()}`}>{d.type}</span></td>
                      <td>{d.amount} {d.type}</td>
                      <td><code>{d.txId}</code></td>
                      <td>{new Date(d.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDonations.length === 0 && <p className="admin-empty">{t('admin.noData')}</p>}
              <div className="admin-actions">
                <button className="btn-secondary" onClick={() => exportCSV(filteredDonations, 'donations.csv')}>
                  📥 {t('admin.exportCSV')}
                </button>
              </div>
            </div>
          )}
          {tab === 'partners' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.name')}</th>
                    <th>{t('admin.contact')}</th>
                    <th>{t('admin.details')}</th>
                    <th>{t('admin.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartners.map((p, i) => (
                    <tr key={i}>
                      <td>{p.name}</td>
                      <td>{p.contact}</td>
                      <td>{p.details}</td>
                      <td>{new Date(p.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPartners.length === 0 && <p className="admin-empty">{t('admin.noData')}</p>}
              <div className="admin-actions">
                <button className="btn-secondary" onClick={() => exportCSV(filteredPartners, 'partners.csv')}>
                  📥 {t('admin.exportCSV')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PartnerForm({ onSubmit, t }) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) return
    
    setSubmitting(true)
    setTimeout(() => {
      onSubmit({ name, contact, details, timestamp: Date.now() })
      setSuccess(true)
      setSubmitting(false)
      setName('')
      setContact('')
      setDetails('')
    }, 500)
  }

  if (success) {
    return (
      <div className="partner-form-success">
        <div className="success-icon">✅</div>
        <h4>{t('partners.successTitle')}</h4>
        <p>{t('partners.successDesc')}</p>
        <button className="btn-secondary" onClick={() => setSuccess(false)}>{t('partners.another')}</button>
      </div>
    )
  }

  return (
    <form className="partner-form" onSubmit={handleSubmit}>
      <div className="partner-form-row">
        <div className="partner-form-group">
          <label>{t('partners.name')}</label>
          <input type="text" placeholder={t('partners.namePH')} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="partner-form-group">
          <label>{t('partners.contact')}</label>
          <input type="text" placeholder={t('partners.contactPH')} value={contact} onChange={(e) => setContact(e.target.value)} required />
        </div>
      </div>
      <div className="partner-form-group">
        <label>{t('partners.details')}</label>
        <textarea placeholder={t('partners.detailsPH')} value={details} onChange={(e) => setDetails(e.target.value)} rows={3} />
      </div>
      <button type="submit" className="btn-primary partner-submit-btn" disabled={submitting}>
        {submitting ? '⏳' : '📤'} {t('partners.submit')}
      </button>
    </form>
  )
}

function WalletSelectModal({ onClose, onSelect, t }) {
  const [connecting, setConnecting] = useState(null)
  const handleConnect = async (wl) => {
    if (IS_MOBILE) {
      const dl = WALLET_DEEP_LINKS.find(w => w.id === wl.id)
      if (dl) {
        window.location.href = dl.scheme + encodeURIComponent(window.location.href)
        return
      }
    }
    const provider = getWalletProvider(wl.id)
    if (provider) {
      setConnecting(wl.id)
      try { await onSelect({ id: wl.id, name: wl.name, icon: wl.icon, provider }) } catch {}
      setConnecting(null)
    } else {
      window.open(wl.url, '_blank')
    }
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal wallet-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 className="modal-title">{t('wallet.select')}</h3>
        <div className="wallet-list">
          {WALLET_LIST.map((wl) => {
            const ok = !!getWalletProvider(wl.id)
            return (
              <button key={wl.id} className="wallet-option" onClick={() => handleConnect(wl)} disabled={connecting === wl.id}>
                <span className="wallet-icon">{wl.icon}</span>
                <span className="wallet-name">{wl.name}</span>
                <span className={`wallet-tag ${ok ? 'ready' : 'get'}`}>
                  {connecting === wl.id ? '...' : ok ? '✓' : '↗'}
                </span>
              </button>
            )
          })}
        </div>
        <p className="wallet-hint">{IS_MOBILE ? t('wallet.mobileHint') : t('wallet.none')}</p>
      </div>
    </div>
  )
}

const COUNTRIES = {
  US: { name: 'USA', x: 18, y: 38, flag: '🇺🇸' },
  RU: { name: 'Russia', x: 52, y: 25, flag: '🇷🇺' },
  CN: { name: 'China', x: 72, y: 36, flag: '🇨🇳' },
  BR: { name: 'Brazil', x: 28, y: 62, flag: '🇧🇷' },
  DE: { name: 'Germany', x: 47, y: 28, flag: '🇩🇪' },
  JP: { name: 'Japan', x: 82, y: 35, flag: '🇯🇵' },
  IN: { name: 'India', x: 65, y: 44, flag: '🇮🇳' },
  GB: { name: 'UK', x: 44, y: 26, flag: '🇬🇧' },
  FR: { name: 'France', x: 45, y: 30, flag: '🇫🇷' },
  KR: { name: 'Korea', x: 79, y: 35, flag: '🇰🇷' },
  CA: { name: 'Canada', x: 17, y: 24, flag: '🇨🇦' },
  AU: { name: 'Australia', x: 80, y: 65, flag: '🇦🇺' },
  UA: { name: 'Ukraine', x: 53, y: 28, flag: '🇺🇦' },
  TR: { name: 'Turkey', x: 53, y: 34, flag: '🇹🇷' },
  NG: { name: 'Nigeria', x: 46, y: 50, flag: '🇳🇬' },
  AR: { name: 'Argentina', x: 25, y: 68, flag: '🇦🇷' },
  MX: { name: 'Mexico', x: 13, y: 42, flag: '🇲🇽' },
  TH: { name: 'Thailand', x: 72, y: 47, flag: '🇹🇭' },
  VN: { name: 'Vietnam', x: 75, y: 46, flag: '🇻🇳' },
  PH: { name: 'Philippines', x: 79, y: 48, flag: '🇵🇭' },
  ID: { name: 'Indonesia', x: 76, y: 56, flag: '🇮🇩' },
  SG: { name: 'Singapore', x: 73, y: 53, flag: '🇸🇬' },
  AE: { name: 'UAE', x: 58, y: 40, flag: '🇦🇪' },
  SA: { name: 'Saudi Arabia', x: 56, y: 39, flag: '🇸🇦' },
  EG: { name: 'Egypt', x: 52, y: 40, flag: '🇪🇬' },
  ZA: { name: 'South Africa', x: 50, y: 66, flag: '🇿🇦' },
  KE: { name: 'Kenya', x: 53, y: 54, flag: '🇰🇪' },
  PK: { name: 'Pakistan', x: 63, y: 39, flag: '🇵🇰' },
  BD: { name: 'Bangladesh', x: 69, y: 43, flag: '🇧🇩' },
  PL: { name: 'Poland', x: 49, y: 26, flag: '🇵🇱' },
}

function AuthModal({ mode, onClose, onSwitch, onAuth, t }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [country, setCountry] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h = h & h } return h.toString(36) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !pass) { setError('Заполните все поля'); return }
    if (pass.length < 6) { setError(t('auth.shortPass')); return }
    setLoading(true)
    try {
      const userRef = ref(db, 'users/' + email.replace(/\./g, ','))
      const userSnap = await get(userRef)
      if (mode === 'register') {
        if (pass !== confirm) { setError(t('auth.passMismatch')); setLoading(false); return }
        if (userSnap.exists()) { setError(t('auth.emailExists')); setLoading(false); return }
        if (!country) { setError(t('auth.country') === 'Country' ? 'Выберите страну' : 'Select a country'); setLoading(false); return }
        const newUser = { email, username: email.split('@')[0], passwordHash: hash(pass), country, createdAt: Date.now() }
        await set(userRef, newUser)
        onAuth({ email, username: email.split('@')[0], country })
      } else {
        const user = userSnap.val()
        if (!user) { setError(t('auth.userNotFound')); setLoading(false); return }
        if (user.passwordHash !== hash(pass)) { setError(t('auth.wrongPass')); setLoading(false); return }
        onAuth({ email, username: user.username })
      }
    } catch (e) {
      setError('Ошибка: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="auth-icon">🏦</div>
        <h2 className="auth-title">{mode === 'register' ? t('auth.register') : t('auth.login')}</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>{t('auth.email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoFocus />
          </div>
          <div className="auth-field">
            <label>{t('auth.password')}</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••" />
          </div>
          {mode === 'register' && (
            <div className="auth-field">
              <label>{t('auth.confirm')}</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••" />
            </div>
          )}
          {mode === 'register' && (
            <div className="auth-field">
              <label>{t('auth.country')}</label>
              <select className="auth-select" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">{t('auth.country')}</option>
                {Object.entries(COUNTRIES).sort((a,b) => a[1].name.localeCompare(b[1].name)).map(([code, c]) => (
                  <option key={code} value={code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
          )}
          <button className="btn-primary auth-btn" type="submit">{mode === 'register' ? t('auth.registerBtn') : t('auth.loginBtn')}</button>
        </form>
        <div className="auth-switch">
          {mode === 'register' ? t('auth.hasAccount') : t('auth.noAccount')}{' '}
          <button className="auth-switch-btn" onClick={() => { setError(''); onSwitch(mode === 'register' ? 'login' : 'register') }}>
            {mode === 'register' ? t('auth.login') : t('auth.register')}
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileModal({ user, publicKey, balance, username, onUsernameChange, onClose, onDisconnect, onConnectWallet, t, lang, activeWalletName }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(username)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('account')
  const mined = parseFloat(localStorage.getItem('filbank-mined') || '0')
  const addr = publicKey?.toBase58?.() || publicKey || ''
  const avatarBg = addr ? `hsl(${parseInt(addr.slice(0, 8), 16) % 360}, 50%, 35%)` : 'hsl(268, 80%, 55%)'
  const avatarLetter = addr ? addr.slice(0, 2).toUpperCase() : (user?.email?.slice(0, 2) || 'FB').toUpperCase()

  const save = () => {
    onUsernameChange(name)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="profile-header">
          <div className="profile-avatar" style={{ background: avatarBg }}>{avatarLetter}</div>
          <div className="profile-info">
            <h3>{username || user?.email || t('profile.no')}</h3>
            <span className="profile-address">{user?.email || (addr ? `${addr.slice(0,6)}...${addr.slice(-4)}` : '')}</span>
          </div>
        </div>
        <div className="profile-tabs">
          <button className={`profile-tab ${tab === 'account' ? 'active' : ''}`} onClick={() => setTab('account')}>{t('profile.title')}</button>
          <button className={`profile-tab ${tab === 'wallet' ? 'active' : ''}`} onClick={() => setTab('wallet')}>Wallet</button>
          <button className={`profile-tab ${tab === 'mining' ? 'active' : ''}`} onClick={() => setTab('mining')}>{t('nav.mining')}</button>
        </div>
        <div className="profile-body">
          {tab === 'account' && (
            <>
              <div className="profile-row"><span className="pr-label">{t('profile.balance')}</span><span className="pr-value">{balance ? `${balance} SOL` : '0.00 SOL'}</span></div>
              <div className="profile-row"><span className="pr-label">{t('profile.filb')}</span><span className="pr-value">0.00</span></div>
              <div className="profile-row"><span className="pr-label">{t('mining.mined')}</span><span className="pr-value">{mined.toFixed(4)} FILB</span></div>
              <div className="profile-edit-row">
                <span className="pr-label">{t('profile.username')}</span>
                {editing ? (
                  <div className="profile-edit-group">
                    <input className="profile-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('profile.username')} autoFocus />
                    <button className="profile-save-btn" onClick={save}>{saved ? t('profile.saved') : t('profile.save')}</button>
                  </div>
                ) : (
                  <button className="profile-edit-btn" onClick={() => setEditing(true)}>{username || t('profile.no')} ✎</button>
                )}
              </div>
            </>
          )}
          {tab === 'social' && (
            <div className="profile-social">
              <h4 style={{marginBottom:16, color:'#fff'}}>{t('og.profile')}</h4>
              {ogData.twitter && ogData.telegram ? (
                <div className="og-status-profile">
                  <span className="og-status-badge-profile">🏆 {t('og.joined')}</span>
                  <p className="og-reward-text">{t('og.reward1')}</p>
                </div>
              ) : (
                <p style={{color:'rgba(255,255,255,0.5)', marginBottom:20}}>{t('og.notYet')}</p>
              )}
              <div className="social-connections">
                <div className={`social-connection ${ogData.twitter ? 'connected' : ''}`}>
                  <div className="social-conn-icon">🐦</div>
                  <div className="social-conn-info">
                    <div className="social-conn-title">{t('og.twitter')}</div>
                    <div className="social-conn-desc">Репост закрепленного твита</div>
                  </div>
                  <span className={`social-conn-status ${ogData.twitter ? 'done' : ''}`}>
                    {ogData.twitter ? '✓ ' + t('og.reposted') : t('og.repost')}
                  </span>
                </div>
                <div className={`social-connection ${ogData.telegram ? 'connected' : ''}`}>
                  <div className="social-conn-icon">📱</div>
                  <div className="social-conn-info">
                    <div className="social-conn-title">{t('og.telegram')}</div>
                    <div className="social-conn-desc">Официальный канал FilBank</div>
                  </div>
                  <span className={`social-conn-status ${ogData.telegram ? 'done' : ''}`}>
                    {ogData.telegram ? '✓ ' + t('og.joinedChannel') : t('og.joinChannel')}
                  </span>
                </div>
              </div>
              {(!ogData.twitter || !ogData.telegram) && (
                <button className="btn-primary og-modal-trigger" onClick={() => { onClose(); setTimeout(() => window.dispatchEvent(new CustomEvent('open-og-modal')), 100) }}>
                  {t('og.join')}
                </button>
              )}
            </div>
          )}
        </div>
        <div className="profile-actions">
          {tab === 'wallet' && (
            <>
              {publicKey ? (
                <>
                  <div className="profile-row"><span className="pr-label">{t('wallet.connected')}</span><span className="pr-value">{activeWalletName || 'Wallet'}</span></div>
                  <div className="profile-row"><span className="pr-label">{t('wallet.address')}</span><span className="pr-value" style={{fontSize:'0.8rem'}}>{addr.slice(0,8)}...{addr.slice(-6)}</span></div>
                  <div className="profile-row"><span className="pr-label">{t('profile.balance')}</span><span className="pr-value">{balance} SOL</span></div>
                </>
              ) : (
                <div className="profile-empty">
                  <p>{t('profile.noWallet')}</p>
                  <button className="btn-primary" onClick={onConnectWallet} style={{marginTop:12}}>{t('profile.connectWallet')}</button>
                </div>
              )}
            </>
          )}
          {tab === 'mining' && (
            <>
              <div className="profile-row"><span className="pr-label">{t('mining.mined')}</span><span className="pr-value">{mined.toFixed(6)} FILB</span></div>
              <div className="profile-row"><span className="pr-label">{t('mining.earnings')}</span><span className="pr-value">~${(mined * 0.001).toFixed(2)}</span></div>
              <div className="profile-staking">
                <h4>{t('profile.staking')}</h4>
                <p>{t('profile.stakingDesc')}</p>
              </div>
            </>
          )}
        </div>
        <div className="profile-actions">
          <button className="profile-disconnect" onClick={onDisconnect}>{t('profile.logout')}</button>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <span className={`faq-arrow ${open ? 'rotated' : ''}`}>▾</span>
      </button>
      <div className="faq-answer" style={{ maxHeight: open ? '200px' : '0', opacity: open ? 1 : 0 }}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

function App() {
  const { t, lang } = useTranslation()
  const { setLang } = useContext(LanguageContext)
  const [publicKey, setPublicKey] = useState(null)
  const [balance, setBalance] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [activeWallet, setActiveWallet] = useState(null)
  const [username, setUsername] = useState(() => localStorage.getItem('filbank-user') || '')
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('filbank-current-user') || 'null') } catch { return null }
  })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('register')
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [showOGModal, setShowOGModal] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [ogParticipants, setOgParticipants] = useState([])
  const [supportDonations, setSupportDonations] = useState([])
  const [partnerRequests, setPartnerRequests] = useState([])
  const [usersCount, setUsersCount] = useState(0)

  // Listen for real-time updates from Firebase
  useEffect(() => {
    const unsub1 = onValue(ref(db, 'ogParticipants'), (snap) => setOgParticipants(snap.val() || []))
    const unsub2 = onValue(ref(db, 'supportDonations'), (snap) => setSupportDonations(snap.val() || []))
    const unsub3 = onValue(ref(db, 'partnerRequests'), (snap) => setPartnerRequests(snap.val() || []))
    const unsub4 = onValue(ref(db, 'users'), (snap) => { const v = snap.val(); setUsersCount(v ? Object.keys(v).length : 0) })
    return () => { unsub1(); unsub2(); unsub3(); unsub4() }
  }, [])

  // Save to Firebase when state changes (debounced)
  useEffect(() => {
    set(ref(db, 'ogParticipants'), ogParticipants)
  }, [ogParticipants])

  useEffect(() => {
    set(ref(db, 'supportDonations'), supportDonations)
  }, [supportDonations])

  useEffect(() => {
    set(ref(db, 'partnerRequests'), partnerRequests)
  }, [partnerRequests])

  // Auto-scan SOL donations from blockchain
  const checkedTx = useRef(new Set())
  useEffect(() => {
    const scan = async () => {
      try {
        const addr = new PublicKey(DONATION_ADDRESS_SOL)
        const sigs = await connection.getSignaturesForAddress(addr, { limit: 10 })
        for (const sig of sigs) {
          if (checkedTx.current.has(sig.signature)) continue
          checkedTx.current.add(sig.signature)
          const tx = await connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 })
          if (!tx?.meta) continue
          const pre = tx.meta.preBalances[0], post = tx.meta.postBalances[0]
          const change = (pre - post) / 1e9
          if (change > 0) {
            const sender = tx.transaction.message.accountKeys[0].pubkey.toBase58()
            setSupportDonations(prev => {
              if (prev.some(d => d.txId === sig.signature)) return prev
              return [...prev, { type: 'SOL', amount: change.toFixed(4), txId: sig.signature, timestamp: sig.blockTime * 1000 || Date.now(), sender }]
            })
          }
        }
      } catch {}
    }
    scan()
    const interval = setInterval(scan, 30000)
    return () => clearInterval(interval)
  }, [])

  // Admin panel hotkey: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        const pwd = prompt(t('admin.pinPrompt'))
        if (pwd === 'filbank2026') setShowAdminPanel(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Listen for OG modal open event
  useEffect(() => {
    const handleOpenOG = () => setShowOGModal(true)
    window.addEventListener('open-og-modal', handleOpenOG)
    return () => window.removeEventListener('open-og-modal', handleOpenOG)
  }, [])

  // Auto-reconnect on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('filbank-wallet')
    const savedKey = localStorage.getItem('filbank-pubkey')
    if (savedWallet && savedKey) {
      const timer = setTimeout(async () => {
        try {
          const wallets = detectWallets()
          const w = wallets.find((x) => x.id === savedWallet)
          if (w?.provider) {
            const resp = await w.provider.connect({ onlyIfTrusted: true })
            setPublicKey(resp.publicKey)
            setActiveWallet(w)
            const bal = await connection.getBalance(resp.publicKey)
            setBalance((bal / 1e9).toFixed(4))
            w.provider.on('disconnect', () => { setPublicKey(null); setBalance(null); setActiveWallet(null); localStorage.removeItem('filbank-wallet'); localStorage.removeItem('filbank-pubkey') })
          }
        } catch { localStorage.removeItem('filbank-wallet'); localStorage.removeItem('filbank-pubkey') }
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [])

  const connectWallet = async (wallet) => {
    setConnecting(true)
    try {
      if (!wallet.provider) { alert(t('wallet.install')); setConnecting(false); return }
      const resp = await wallet.provider.connect()
      setPublicKey(resp.publicKey)
      setActiveWallet(wallet)
      localStorage.setItem('filbank-wallet', wallet.id)
      localStorage.setItem('filbank-pubkey', resp.publicKey.toBase58())
      const bal = await connection.getBalance(resp.publicKey)
      setBalance((bal / 1e9).toFixed(4))
      wallet.provider.on('disconnect', () => {
        setPublicKey(null); setBalance(null); setActiveWallet(null)
        localStorage.removeItem('filbank-wallet'); localStorage.removeItem('filbank-pubkey')
      })
      setShowWalletModal(false)
    } catch (e) { console.error(e); alert(t('wallet.error')) }
    finally { setConnecting(false) }
  }

  const disconnect = async () => {
    if (activeWallet?.provider) try { await activeWallet.provider.disconnect() } catch {}
    setPublicKey(null); setBalance(null); setActiveWallet(null)
    localStorage.removeItem('filbank-wallet'); localStorage.removeItem('filbank-pubkey')
    setShowProfile(false)
  }

  const handleUsernameChange = async (name) => {
    setUsername(name)
    localStorage.setItem('filbank-user', name)
    if (currentUser) {
      const updated = { ...currentUser, username: name }
      setCurrentUser(updated)
      localStorage.setItem('filbank-current-user', JSON.stringify(updated))
      const userRef = ref(db, 'users/' + currentUser.email.replace(/\./g, ','))
      const userSnap = await get(userRef)
      if (userSnap.exists()) {
        await set(userRef, { ...userSnap.val(), username: name })
      }
    }
  }

  const handleAuth = (user) => {
    const userData = { ...user, createdAt: user.createdAt || Date.now() }
    setCurrentUser(userData)
    localStorage.setItem('filbank-current-user', JSON.stringify(userData))
    setShowAuthModal(false)
    setUsername(userData.username || '')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('filbank-current-user')
    if (activeWallet?.provider) try { activeWallet.provider.disconnect() } catch {}
    setPublicKey(null); setBalance(null); setActiveWallet(null)
    localStorage.removeItem('filbank-wallet'); localStorage.removeItem('filbank-pubkey')
    setShowProfile(false)
  }

  const openSupportModal = () => {
    setShowSupportModal(true)
  }

  const handlePartnerRequest = (data) => {
    setPartnerRequests(prev => [...prev, data])
  }

  const handleOGParticipant = (e) => {
    const participant = e.detail
    setOgParticipants(prev => {
      const exists = prev.some(p => p.wallet === participant.wallet && p.twitter === participant.twitter)
      if (exists) return prev
      return [...prev, participant]
    })
  }

  const handleDonate = (data) => {
    setSupportDonations(prev => [...prev, data])
  }

  useEffect(() => {
    window.addEventListener('og-participant-added', handleOGParticipant)
    return () => window.removeEventListener('og-participant-added', handleOGParticipant)
  }, [])

  useEffect(() => {
    let sec = 0
    const el = document.getElementById('launch-sec')
    const circle = document.querySelector('.launch-counter-circle')
    const maxLen = 339.3
    const tick = () => {
      sec = (sec % 60) + 1
      if (el) el.textContent = sec
      if (circle) circle.style.strokeDashoffset = maxLen - (maxLen * sec / 60)
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  const shortAddress = (addr) => addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : ''
  const addrStr = publicKey?.toBase58?.() || publicKey || ''

  return (
    <div className="app">
      <Particles />
      <header className="header">
        <div className="logo">
          <div className="logo-icon-3d">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <defs><linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#9945ff"/><stop offset="100%" stopColor="#14f195"/></linearGradient></defs>
              <circle cx="24" cy="24" r="18" fill="rgba(0,0,0,0.12)"/>
              <circle cx="22" cy="22" r="18" fill="rgba(20,241,149,0.12)"/>
              <circle cx="21" cy="21" r="18" fill="rgba(153,69,255,0.3)"/>
              <circle cx="20" cy="20" r="18" fill="url(#logoGrad)"/>
              <circle cx="20" cy="20" r="12" fill="rgba(0,0,0,0.1)"/>
              <path d="M15 14h10v3h-6v3h5v3h-5v8h-4V14z" fill="white"/>
            </svg>
          </div>
          <div className="logo-text-group">
            <span className="logo-text">FilBank</span>
            <span className="logo-sub">{t('logo.sub')}</span>
          </div>
        </div>
        <div className="header-brand-3d">
          <span className="h3d-text">$FILB</span>
          <span className="h3d-sub">{t('h3d.sub')}</span>
        </div>
        <div className="header-right">
          <button className="lang-btn" onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}>
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>
          <nav className="nav">
            <a href="#features" className="nav-link">{t('nav.features')}</a>
            <a href="#advantages" className="nav-link">{t('nav.advantages')}</a>
            <a href="#mining" className="nav-link">{t('nav.mining')}</a>
          </nav>
          <button className="support-btn-header" onClick={() => setShowSupportModal(true)} title={t('support.title')}>
            <span>💎</span>
          </button>
          {(currentUser || publicKey) && (
            <button className="profile-btn" onClick={() => setShowProfile(true)}>
              <span className="profile-btn-avatar" style={{ background: publicKey ? `hsl(${parseInt(addrStr.slice(0, 8), 16) % 360}, 50%, 35%)` : 'hsl(268, 80%, 55%)' }}>
                {publicKey ? addrStr.slice(0, 2).toUpperCase() : (currentUser?.email?.slice(0, 2) || 'FB').toUpperCase()}
              </span>
            </button>
          )}
          {!currentUser && !publicKey && (
            <div className="auth-buttons">
              <button className="auth-btn-header" onClick={() => { setAuthMode('login'); setShowAuthModal(true) }}>{t('auth.login')}</button>
              <button className="btn-primary auth-btn-header" onClick={() => { setAuthMode('register'); setShowAuthModal(true) }}>{t('auth.register')}</button>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">{t('hero.badge')}</div>
            <h1 className="hero-title">
              {t('hero.title1')}<br />
              <span className="gradient-text">{t('hero.title2')}</span>
            </h1>
            <p className="hero-subtitle">
              {t('hero.subtitle')}<br />
              {t('hero.subtitle2')} <strong>$FILB</strong>
            </p>
            <div className="hero-cta">
              {!publicKey ? (
                <button className="btn-primary" onClick={() => setShowWalletModal(true)} disabled={connecting}>
                  {connecting ? `⏳ ${t('wallet.connecting')}` : `👻 ${t('wallet.connect')}`}
                </button>
              ) : (
                <div className="wallet-badge">
                  <span className="wallet-balance">{balance} SOL</span>
                  <button className="wallet-address" onClick={() => navigator.clipboard.writeText(addrStr)}>{shortAddress(addrStr)}</button>
                  <button className="btn-disconnect" onClick={disconnect}>✕</button>
                </div>
              )}
            </div>
            <div className="hero-stats">
              {(() => {
                const mined = parseFloat(localStorage.getItem('filbank-mined') || '0')
                return (
                  <>
                    <div className="hero-stat"><span className="hero-stat-value">{usersCount}</span><span className="hero-stat-label">{t('hero.stat.users')}</span></div>
                    <div className="hero-stat"><span className="hero-stat-value">{mined.toFixed(2)} FILB</span><span className="hero-stat-label">{t('hero.stat.tvl')}</span></div>
                    <div className="hero-stat"><span className="hero-stat-value">6</span><span className="hero-stat-label">{t('hero.stat.features')}</span></div>
                  </>
                )
              })()}
            </div>
          </div>
          <FloatingCoin />
        </section>

        <section id="features" className="features-section">
          <div className="section-header">
            <h2>{t('features.title')}</h2>
            <p>{t('features.subtitle')}</p>
          </div>
          <div className="features-grid">
            <div className="feature-card" style={{ '--accent': '#9945ff' }}>
              <div className="feature-glow"></div>
              <div className="feature-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9945ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <h3>{t('feature.staking.title')}</h3><p>{t('feature.staking.desc')}</p>
            </div>
            <div className="feature-card" style={{ '--accent': '#14f195' }}>
              <div className="feature-glow"></div>
              <div className="feature-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14f195" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <h3>{t('feature.lending.title')}</h3><p>{t('feature.lending.desc')}</p>
            </div>
            <div className="feature-card" style={{ '--accent': '#f59e0b' }}>
              <div className="feature-glow"></div>
              <div className="feature-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3>{t('feature.invest.title')}</h3><p>{t('feature.invest.desc')}</p>
            </div>
            <div className="feature-card" style={{ '--accent': '#ef4444' }}>
              <div className="feature-glow"></div>
              <div className="feature-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h3>{t('feature.mining.title')}</h3><p>{t('feature.mining.desc')}</p>
            </div>
          </div>
        </section>

        <section id="card-section" className="card-section">
          <div className="section-header">
            <h2>{t('card.title')}</h2>
            <p>{t('card.subtitle')}</p>
          </div>
          <div className="card-showcase">
            <BankCard />
            <div className="card-features-right">
              <div className="card-feature-item">
                <span className="cif-icon">💳</span>
                <div><h4>{t('card.feature1.title')}</h4><p>{t('card.feature1.desc')}</p></div>
              </div>
              <div className="card-feature-item">
                <span className="cif-icon">🔄</span>
                <div><h4>{t('card.feature2.title')}</h4><p>{t('card.feature2.desc')}</p></div>
              </div>
              <div className="card-feature-item">
                <span className="cif-icon">🎁</span>
                <div><h4>{t('card.feature3.title')}</h4><p>{t('card.feature3.desc')}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="advantages" className="advantages-section">
          <div className="section-header">
            <h2>{t('adv.title')}</h2>
            <p>{t('adv.subtitle')}</p>
          </div>
          <div className="advantages-grid">
            {[['🌐','adv1'],['🛡️','adv2'],['📈','adv3'],['🔗','adv4'],['⚡','adv5'],['🤖','adv6']].map(([icon, key]) => (
              <div key={key} className="advantage-card">
                <div className="adv-icon">{icon}</div>
                <div className="adv-content">
                  <h3>{t(`${key}.title`)}</h3>
                  <p>{t(`${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="mining"><MiningSection /></section>

        <section className="roadmap-section">
          <div className="section-header">
            <h2>{t('roadmap.title')}</h2>
            <p>{t('roadmap.subtitle')}</p>
          </div>
          <div className="roadmap-grid">
            {[
              ['✅','done','Q2 2026','roadmap1'],
              ['🔄','current','Q2 2026','roadmap2'],
              ['📋','','Q3 2026','roadmap3'],
              ['📋','','Q3 2026','roadmap4'],
              ['📋','','Q4 2026','roadmap5'],
            ].map(([icon, status, date, key]) => (
              <div key={key} className={`roadmap-item ${status}`}>
                <div className="rm-icon">{icon}</div>
                <div className="rm-dot"></div>
                <div className="rm-content">
                  <span className="rm-date">{date}</span>
                  <h4>{t(`${key}.title`)}</h4>
                  <p>{t(`${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="hq" className="hq-section">
          <div className="hq-bg">
            <div className="hq-grid-floor"></div>
            <div className="hq-particles"></div>
          </div>
          <div className="section-header">
            <h2>{t('hq.title')}</h2>
            <p>{t('hq.subtitle')}</p>
          </div>
          <div className="hq-showcase">
            <div className="hq-skyline">
              <div className="hq-territory">
                <div className="hq-ground"></div>
                <div className="hq-road hq-road-1"></div>
                <div className="hq-road hq-road-2"></div>
                <div className="hq-tree hq-tree-1"></div>
                <div className="hq-tree hq-tree-2"></div>
                <div className="hq-tree hq-tree-3"></div>
                <div className="hq-tree hq-tree-4"></div>
                <div className="hq-pond"></div>
                <div className="hq-parking"></div>
                <div className="hq helipad">
                  <div className="helipad-h">H</div>
                </div>
              </div>
              <div className="hq-building-wrapper">
                <div className="hq-building">
                  <div className="hq-antenna">
                    <div className="hq-antenna-light"></div>
                    <div className="hq-antenna-beam"></div>
                  </div>
                  <div className="hq-roof"></div>
                  <div className="hq-spire"></div>
                  <div className="hq-floors">
                    {Array.from({length: 28}, (_, i) => (
                      <div key={i} className="hq-floor" style={{'--fi': i}}>
                        <div className="hq-win-row">
                          {Array.from({length: 6}, (_, j) => (
                            <div key={j} className={`hq-window ${Math.random() > 0.3 ? 'lit' : ''}`} style={{'--wj': j, animationDelay: `${(i * 0.1 + j * 0.15).toFixed(1)}s`}}></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="hq-foundation">
                    <div className="hq-entrance">
                      <div className="hq-door"></div>
                      <div className="hq-door-glow"></div>
                    </div>
                  </div>
                  <div className="hq-hologram-ring hq-ring-1"></div>
                  <div className="hq-hologram-ring hq-ring-2"></div>
                  <div className="hq-hologram-ring hq-ring-3"></div>
                  <div className="hq-holo-text">$FILB</div>
                </div>
                <div className="hq-reflection"></div>
                <div className="hq-shadow"></div>
              </div>
              <div className="hq-side-building hhq-side-1">
                <div className="hq-side-roof"></div>
                {Array.from({length: 8}, (_, i) => (
                  <div key={i} className="hq-side-floor">
                    {Array.from({length: 4}, (_, j) => (
                      <div key={j} className={`hq-side-win ${Math.random() > 0.4 ? 'lit' : ''}`}></div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="hq-side-building hq-side-2">
                <div className="hq-side-roof"></div>
                {Array.from({length: 6}, (_, i) => (
                  <div key={i} className="hq-side-floor">
                    {Array.from({length: 3}, (_, j) => (
                      <div key={j} className={`hq-side-win ${Math.random() > 0.4 ? 'lit' : ''}`}></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="hq-info">
              <div className="hq-info-card">
                <div className="hq-info-icon">🏗️</div>
                <h4>{t('hq.card1.title')}</h4>
                <p>{t('hq.card1.desc')}</p>
              </div>
              <div className="hq-info-card">
                <div className="hq-info-icon">🌍</div>
                <h4>{t('hq.card2.title')}</h4>
                <p>{t('hq.card2.desc')}</p>
              </div>
              <div className="hq-info-card">
                <div className="hq-info-icon">⚡</div>
                <h4>{t('hq.card3.title')}</h4>
                <p>{t('hq.card3.desc')}</p>
              </div>
              <div className="hq-info-card">
                <div className="hq-info-icon">🔐</div>
                <h4>{t('hq.card4.title')}</h4>
                <p>{t('hq.card4.desc')}</p>
              </div>
            </div>
          </div>
          <div className="hq-specs">
            <div className="hq-spec"><span className="hq-spec-val">2030</span><span className="hq-spec-label">{t('hq.spec.year')}</span></div>
            <div className="hq-spec"><span className="hq-spec-val">120m</span><span className="hq-spec-label">{t('hq.spec.height')}</span></div>
            <div className="hq-spec"><span className="hq-spec-val">50,000</span><span className="hq-spec-label">{t('hq.spec.area')}</span></div>
            <div className="hq-spec"><span className="hq-spec-val">∞</span><span className="hq-spec-label">{t('hq.spec.vision')}</span></div>
          </div>
        </section>

        <section id="partners" className="partners-section">
          <div className="section-header">
            <h2>{t('partners.title')}</h2>
            <p>{t('partners.subtitle')}</p>
          </div>
          <div className="partners-grid">
            {[
              { name: 'Solana', color: '#9945FF', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M4.47 15.68a.7.7 0 0 1-.48-.19.68.68 0 0 1-.19-.47h2.04a.7.7 0 0 1 .48.19c.13.13.19.3.19.47s-.06.33-.19.47a.7.7 0 0 1-.48.19H4.47zm0-4.2a.7.7 0 0 1-.48-.19.68.68 0 0 1-.19-.47h2.04a.7.7 0 0 1 .48.19c.13.13.19.3.19.47s-.06.33-.19.47a.7.7 0 0 1-.48.19H4.47zm0-4.2a.7.7 0 0 1-.48-.19.68.68 0 0 1-.19-.47h2.04a.7.7 0 0 1 .48.19c.13.13.19.3.19.47s-.06.33-.19.47a.7.7 0 0 1-.48.19H4.47zM8.5 3H15a.5.5 0 0 1 .42.78l-3.25 4.88a.5.5 0 0 1-.42.22H8.5a.5.5 0 0 1-.42-.78L11.33 3.22A.5.5 0 0 1 11.75 3H8.5zm0 12H15a.5.5 0 0 1 .42.78l-3.25 4.88a.5.5 0 0 1-.42.22H8.5a.5.5 0 0 1-.42-.78L11.33 15.22A.5.5 0 0 1 11.75 15H8.5zM15.5 7h-7a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zm0 10h-7a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1z"/></svg> },
              { name: 'Phantom', color: '#AB9FF2', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> },
              { name: 'Pump.fun', color: '#FF6B35', icon: '🚀' },
              { name: 'Raydium', color: '#59FFA3', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
              { name: 'Solflare', color: '#FF9338', icon: '🔥' },
              { name: 'Backpack', color: '#F7931A', icon: '🎒' },
            ].map((p) => (
              <div key={p.name} className="partner-card">
                <div className="partner-icon" style={{ color: p.color }}>{typeof p.icon === 'string' ? p.icon : p.icon}</div>
                <span className="partner-name">{p.name}</span>
              </div>
            ))}
          </div>
          
          <div className="partner-form-section">
            <h3>{t('partners.becomePartner')}</h3>
            <p className="partner-form-desc">{t('partners.formDesc')}</p>
            <PartnerForm onSubmit={handlePartnerRequest} t={t} />
          </div>
        </section>

        <DonationVault t={t} donations={supportDonations} />

        <section id="faq" className="faq-section">
          <div className="section-header">
            <h2>{t('faq.title')}</h2>
            <p>{t('faq.subtitle')}</p>
          </div>
          <div className="faq-list">
            {[
              ['faq.q1','faq.a1'], ['faq.q2','faq.a2'], ['faq.q3','faq.a3'], ['faq.q4','faq.a4'], ['faq.q5','faq.a5'], ['faq.q6','faq.a6'], ['faq.q7','faq.a7']
            ].map(([q, a], i) => (
              <FAQItem key={i} question={t(q)} answer={t(a)} />
            ))}
          </div>
        </section>

        <section id="launch" className="launch-section">
          <div className="launch-bg">
            <div className="launch-orb launch-orb-1"></div>
            <div className="launch-orb launch-orb-2"></div>
            <div className="launch-orb launch-orb-3"></div>
          </div>
          <div className="launch-content">
            <div className="launch-badge">{t('launch.dev')}</div>
            <div className="launch-soon">{t('launch.soon')}</div>
            <h2 className="launch-title">{t('launch.title')}</h2>
            <p className="launch-subtitle">{t('launch.subtitle')}</p>
            <div className="launch-counter">
              <div className="launch-counter-ring">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2"/>
                  <circle cx="60" cy="60" r="54" fill="none" stroke="url(#counterGrad)" strokeWidth="3"
                    strokeDasharray="339.3" strokeDashoffset="0" strokeLinecap="round"
                    className="launch-counter-circle"/>
                  <defs>
                    <linearGradient id="counterGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#9945ff"/>
                      <stop offset="100%" stopColor="#14f195"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="launch-counter-inner">
                  <span className="launch-counter-val" id="launch-sec">0</span>
                  <span className="launch-counter-unit">sec</span>
                </div>
              </div>
              <div className="launch-counter-pulse"></div>
            </div>
            <div className="launch-phases">
              <div className="launch-phase active">
                <div className="lp-dot"></div>
                <span>{t('launch.phase')} 1</span>
                <small>{t('launch.phase1')}</small>
              </div>
              <div className="launch-phase-line"></div>
              <div className="launch-phase current">
                <div className="lp-dot"></div>
                <span>{t('launch.phase')} 2</span>
                <small>{t('launch.phase2')}</small>
              </div>
              <div className="launch-phase-line"></div>
              <div className="launch-phase">
                <div className="lp-dot"></div>
                <span>{t('launch.phase')} 3</span>
                <small>{t('launch.phase3')}</small>
              </div>
            </div>
            <div className="launch-progress-wrap">
              <div className="launch-progress-label">
                <span>{t('launch.progress')}</span>
                <span>{t('launch.progressVal')}</span>
              </div>
              <div className="launch-progress-bar">
                <div className="launch-progress-fill" style={{width: '47%'}}></div>
                <div className="launch-progress-glow"></div>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-top">
            <div className="footer-brand-col">
              <div className="footer-logo-group">
                <div className="footer-logo-icon">
                  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
                    <defs><linearGradient id="fGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#9945ff"/><stop offset="100%" stopColor="#14f195"/></linearGradient></defs>
                    <circle cx="22" cy="22" r="18" fill="url(#fGrad)"/>
                    <circle cx="22" cy="22" r="12" fill="rgba(0,0,0,0.1)"/>
                    <path d="M15 14h10v3h-6v3h5v3h-5v8h-4V14z" fill="white"/>
                  </svg>
                </div>
                <span className="footer-logo-text">FilBank</span>
              </div>
              <p className="footer-desc">{t('footer.brand')}</p>
              <div className="footer-socials">
                <a href="https://x.com/cukov39096?s=11" target="_blank" rel="noopener" className="footer-social" aria-label="X/Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://t.me/FilBankofficial" target="_blank" rel="noopener" className="footer-social" aria-label="Telegram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </a>
                <a href="https://discord.gg/filbank" target="_blank" rel="noopener" className="footer-social" aria-label="Discord">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
                </a>
                <a href="https://youtube.com/@funny23_moment23?si=6B1iT1VKGE2Sdnc0" target="_blank" rel="noopener" className="footer-social" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://github.com/filbank" target="_blank" rel="noopener" className="footer-social" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">{t('footer.product')}</h4>
              <a href="#features" className="footer-link">{t('footer.staking')}</a>
              <a href="#mining" className="footer-link">{t('footer.mining')}</a>
              <a href="#features" className="footer-link">{t('footer.defi')}</a>
              <a href="#card-section" className="footer-link">{t('h3d.sub')}</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">{t('footer.resources')}</h4>
              <a href="https://docs.solana.com" target="_blank" rel="noopener" className="footer-link">{t('footer.docs')}</a>
              <a href="https://github.com/filbank" target="_blank" rel="noopener" className="footer-link">{t('footer.github')}</a>
              <a href="#" className="footer-link">{t('footer.blog')}</a>
              <a href="#" className="footer-link">{t('footer.careers')}</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">{t('footer.legal')}</h4>
              <a href="#privacy" className="footer-link">{t('footer.privacy')}</a>
              <a href="#terms" className="footer-link">{t('footer.terms')}</a>
              <a href="#audit" className="footer-link">{t('footer.audit')}</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>{t('footer.copy')}</span>
            <span className="footer-solana-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              {t('footer.built')}
            </span>
            <button className="footer-admin-link" onClick={() => {
              const pwd = prompt(t('admin.pinPrompt'))
              if (pwd === 'filbank2026') setShowAdminPanel(true)
            }}>⚙️</button>
          </div>
        </footer>
      </main>

      {showWalletModal && <WalletSelectModal t={t} onClose={() => setShowWalletModal(false)} onSelect={connectWallet} />}
      {showProfile && <ProfileModal user={currentUser} publicKey={publicKey} balance={balance} username={username} onUsernameChange={handleUsernameChange} onClose={() => setShowProfile(false)} onDisconnect={handleLogout} onConnectWallet={() => { setShowProfile(false); setShowWalletModal(true) }} t={t} lang={lang} activeWalletName={activeWallet?.name || ''} />}
      {showAuthModal && <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} onSwitch={setAuthMode} onAuth={handleAuth} t={t} />}
      {showSupportModal && <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} t={t} donations={supportDonations} onDonate={handleDonate} />}
      {showOGModal && <OGModal isOpen={showOGModal} onClose={() => setShowOGModal(false)} t={t} publicKey={publicKey} onConnectWallet={() => { setShowOGModal(false); setShowWalletModal(true) }} connectedWallet={activeWallet?.name || ''} />}
      {showAdminPanel && <AdminPanel isOpen={showAdminPanel} onClose={() => setShowAdminPanel(false)} t={t} ogParticipants={ogParticipants} supportDonations={supportDonations} partnerRequests={partnerRequests} onAddDonation={handleDonate} onAddOG={(p) => setOgParticipants(prev => prev.some(x => x.wallet === p.wallet) ? prev : [...prev, p])} />}
    </div>
  )
}

export default function AppWrapper() {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  )
}