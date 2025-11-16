-- Complete setup script for PostgreSQL 18
-- Run this entire file in pgAdmin Query Tool

-- Create database (if not exists)
-- Note: You may need to run this separately if database doesn't exist
-- CREATE DATABASE sow;

-- Make sure you're connected to sow database
-- Then run everything below:

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS translations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Translations table for multi-language support
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL,
    language VARCHAR(2) NOT NULL, -- 'en' or 'sv'
    value TEXT NOT NULL,
    page VARCHAR(50), -- 'login', 'terms', 'pricelist'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(key, language)
);

-- Products table for pricelist
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    article_no VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    in_price DECIMAL(10,2),
    price DECIMAL(10,2),
    unit VARCHAR(50),
    in_stock DECIMAL(10,2),
    vat_rate DECIMAL(5,2),
    account VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_translations_key_language ON translations(key, language);
CREATE INDEX idx_translations_page ON translations(page);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_article_no ON products(article_no);

-- Insert translations (Login page - Swedish)
INSERT INTO translations (key, language, value, page) VALUES
('login.title', 'sv', 'Logga in', 'login'),
('login.email_label', 'sv', 'Skriv in din epost adress', 'login'),
('login.email_placeholder', 'sv', 'Epost adress', 'login'),
('login.password_label', 'sv', 'Skriv in ditt lösenord', 'login'),
('login.password_placeholder', 'sv', 'Lösenord', 'login'),
('login.submit', 'sv', 'Logga in', 'login'),
('login.register', 'sv', 'Registrera dig', 'login'),
('login.forgot', 'sv', 'Glömt lösenord?', 'login'),
('nav.home', 'sv', 'Hem', 'login'),
('nav.order', 'sv', 'Beställ', 'login'),
('nav.customers', 'sv', 'Våra Kunder', 'login'),
('nav.about', 'sv', 'Om oss', 'login'),
('nav.contact', 'sv', 'Kontakta oss', 'login'),
('nav.language', 'sv', 'Svenska', 'login');

-- Insert translations (Login page - English)
INSERT INTO translations (key, language, value, page) VALUES
('login.title', 'en', 'Log in', 'login'),
('login.email_label', 'en', 'Enter your email address', 'login'),
('login.email_placeholder', 'en', 'Email address', 'login'),
('login.password_label', 'en', 'Enter your password', 'login'),
('login.password_placeholder', 'en', 'Password', 'login'),
('login.submit', 'en', 'Log in', 'login'),
('login.register', 'en', 'Register', 'login'),
('login.forgot', 'en', 'Forgotten password?', 'login'),
('nav.home', 'en', 'Home', 'login'),
('nav.order', 'en', 'Order', 'login'),
('nav.customers', 'en', 'Our Customers', 'login'),
('nav.about', 'en', 'About us', 'login'),
('nav.contact', 'en', 'Contact Us', 'login'),
('nav.language', 'en', 'English', 'login');

-- Insert translations (Terms page - Swedish)
INSERT INTO translations (key, language, value, page) VALUES
('terms.title', 'sv', 'Villkor', 'terms'),
('terms.button', 'sv', 'Stäng och gå tillbaka', 'terms'),
('terms.content', 'sv', 'GENOM ATT klicka på Fakturera Nu så väljer ni att registrera enligt den information som ni har lagt in och texten på registrerings sidan och villkoren här, och accepterar samtidigt villkoren här.

Ni kan använda programmet GRATIS i 14 dagar.

123 Fakturera är så lätt och självförklarande att chansen för att du kommer behöva support är minimal, men om du skulle behöva support, så är vi här för dig, med vårt kontor bemannat större delen av dygnet. Efter provperioden så fortsätter abonnemanget och kostar 99 kronor exkl. moms per månad, som faktureras årligen. Om du inte vill behålla programmet, så är det bara att avbryta provperioden genom att ge oss besked inom 14 dagar från registrering.

Ni har självklart rätt att avsluta användningen av programmet utan kostnad, genom att ge oss besked per email inom 14 dagar från registrering, att ni inte vill fortsätta med programmet, och betalar då självklart inte heller något.

Om vi inte inom 14 dagar från registrering mottar sådant besked från er, så kan ordern av naturliga orsaker inte ändras. Med registrering menas det datum och klockslag då ni valde att trycka på knappen Fakturera Nu.

Fakturering sker för ett år i taget.

Priset för 123 Fakturera (specialpris kr 99:- / ord. pris kr 159:- per månad) är för årsavgift Start för ett års användning av programmet.

(Vid användning av specialpriset kr 99:- så räknas ett års perioden från registrering.)

Alla priser är exkl. moms.

Offert, Lagerstyrning, Medlemsfakturering, Fleranvändarversion och Engelsk utskrift är (eller kan vara) tilläggsmoduler som kan beställas senare.

Förmedling, samt fakturering kan komma att ske från K-Soft Sverige AB, Box 2826, 187 28 Täby. Vi kan i framtiden välja att samarbeta med annat företag för t.ex. förmedling och fakturering. Kundförhållandet är dock självklart med oss. Betalningen görs till det företag som fakturan kommer från.

Årsavgiften är löpande men om ni inte vill fortsätta att använda programmet, så är det bara att ge besked trettio dagar innan ingången av nästföljande ett års period.

Introduktionspriset (kr 99:- per månad) är för årsavgift Start för det första året. Efter det första året faktureras ord. pris vilket för närvarande är, för årsavgift Start, ett hundra och femtinio kronor per månad, för årsavgift Fjärrstyrning, tre hundra kronor per månad och för årsavgift Pro, tre hundra och trettiotre kronor per månad. Efter ett år faktureras årsavgift Fjärrstyrning som standard men ni kan välja Start eller Pro genom att ge besked när som helst innan förfallodagen.

Om ni väljer att behålla programmet genom att inte ge oss besked per email innan 14 dagar från registrering, om att ni inte vill fortsätta med programmet, så accepterar ni att ni kommer att betala fakturan för er beställning. Att inte betala fakturan eller sen betalning ger inte rätt till att annullera beställningen. Vi hjälper gärna att fiksa logo för er till självkostpris.

Licens för användning av 123 Fakturera säljs självklart enligt gällande lagar.

För att lättare kunna hjälpa er och ge er support samt för att följa lagarna, måste vi av naturliga orsaker spara er information.

I samband med lagring av information så kräver lagen att vi ger er följande information:

Om ni beställer som privatperson så har ni den ångerrätt som lagen fastställer. Er information sparas så att vi kan hjälpa er m.m. Vi kommer använda den för att kunna hjälpa er om ni behöver hjälp, följa lagarna ang. bokföring m.m. När det kommer uppgraderingar och liknande, kan vi komma att skicka er erbjudande och liknande om våra produkter och tjänster per email eller liknande. Ni kan också komma att bli kontaktad per email, post och telefon. Om ni inte vill bli kontaktad, bara skicka oss en email ang. det.

Ni kan när som helst begära att inte få tillsänt information om uppgraderingar per email, brev eller liknande och vi kommer då självklart inte att göra det. Sådan begäran skickar ni till oss per email, brev eller liknande.

Av naturliga orsaker måste vi spara, databehandla och flytta era data. Er information sparas tills vidare. Ni ger oss medgivande till att lagra, databehandla och flytta era data, samt att skicka er erbjudanden och liknande per email, brev och liknande, samt att informera andra om att ni är kund. Pga. sättet det fungerar på med programvara behöver medgivandet också ges till andra parter. Medgivandet ges därför till oss, samt till de företag och/eller person/personer som äger programvaran, källkod, hemsidan och liknande. Det ges också till nuvarande och framtida företag ägda och/eller kontrollerade av en eller flera av de som i dag äger och/eller kontrollerar oss. Det ges också till nuvarande och framtida personer (om några) som äger eller kommer till att äga programvaran, källkod, hemsidan och liknande. Detta både för nuvarande och framtida produkter och tjänster. Det ges också till ett annat företag, (som K-Soft Sverige AB), som vi kan använda för att skicka/sälja produkter, uppgraderingar och liknande, antingen genom att under förmedla programvaran eller på annat sätt.

Ni har självklart rätt att begära tillgång till, rättelse eller radering av informationen vi har om er. Ni har också rätt att begära begränsning av behandlingen av era uppgifter, eller att invända mot behandling samt rätten till dataportabilitet. Ni har självklart rätt att klaga till tillsynsmyndighet. Mer juridisk info om oss hittar ni här. Det är lagarna i Irland som är gällande lagar. Det är självklart helt frivilligt att lägga er order. Vi använder självklart inte någon automatiserad profilering och inte heller något automatiserat beslutsfattande.

Om ni vill kontakta oss, vänligen använd då informationen på denna hemsidan.

Klicka på Fakturera Nu för att registrera i enlighet med den information som ni har lagt in och villkoren här. (Datum och tidpunkt för inläggningen läggs in automatiskt i våra register.)

Vår erfarenhet är att våra kunder är mycket nöjda med sättet vi arbetar på och vi hoppas och tror att det också kommer att bli er upplevelse.

Ha en trevlig dag!', 'terms');

-- Insert translations (Terms page - English)
INSERT INTO translations (key, language, value, page) VALUES
('terms.title', 'en', 'Terms', 'terms'),
('terms.button', 'en', 'Close and Go Back', 'terms'),
('terms.content', 'en', 'BY clicking Invoice Now, you choose to register according to the information that you have typed in and the text on the registration page and the terms here, and you at the same time accept the terms here.

You can use the program FOR FREE for 14 days.

123 Fakturera is so easy and self-explanatory that the chance that you will need support is minimal, but if you should need support, we are here for you, with our office manned for the most part of the day. After the trial period, the subscription continues and costs SEK 99 excluding VAT per month, which is billed annually. If you do not want to keep the program, just cancel the trial period by giving notice before 14 days from registration.

You have of course the right to terminate the use of the program without any costs, by giving us notice per email before 14 days from registration, that you do not want to continue with the program, and you then of course do not pay anything.

If we do not receive such a notice from you before 14 days from registration, then the order, for natural reasons, cannot be changed. With registration it is meant the date and time when you did choose to press the button Invoice Now.

Billing is for one year at a time.

The price for 123 Fakturera (offer price SEK 99 per month / ordinary price SEK 159 per month) is for the annual fee Start for one year''s use of the program.

(When using the offer price of SEK 99, the one-year period is calculated from registration.)

All prices are excluding. VAT.

Offer, Inventory Control, Member Invoicing, Multiuser version and English printout are (or can be) additional modules that can be ordered later.

Intermediation, as well as invoicing, may take place from K-Soft Sverige AB, Box 2826, 187 28 Täby. In the future, we may choose to cooperate with another company for e.g. intermediation and invoicing. However, the customer relationship is with us. The payment is made to the company from which the invoice comes.

The annual fee is on a continuous basis, but if you do not wish to continue using the program, all you have to do is give notice thirty days before the start of the next one-year period.

The introductory offer ( SEK 99 per month) is for the annual fee Start for the first year. After the first year, the ordinary price is billed, which is currently, for annual fee Start, one hundred and fifty-nine kroner per month, for annual fee Remote control, three hundred kroner per month and for annual fee Pro, three hundred and thirty-three kroner per month. After one year, the annual Remote Control fee is invoiced as standard, but you can choose Start or Pro by giving notice at any time before the due date.

If you choose to keep the program by not notifying us by email within 14 days of registration that you do not wish to continue with the program, you accept that you will pay the invoice for your order. Failure to pay the invoice or late payment does not give the right to cancel the order. We are happy to help you with logo at a cost price.

License for the use of 123 Fakturera is of course sold in accordance with applicable laws.

In order to be able to help you more easily and provide you with support, as well as to comply with the laws, we, for natural reasons, have to store your information.

In connection with the storage of information, the law requires that we provide you with the following information:

If you order as a private person, you have the right to cancel as stated by law. Your information is stored so that we can help you, etc. We will use it to be able to help you if you need help, follow the laws regarding bookkeeping, etc. When there are upgrades and the like, we may send you offers and the like about our products and services by email or the like. You may be contacted by email, post and telephone. If you don''t want to be contacted, just send us an email about it.

You can at any time ask not to be sent information about upgrades by email, letter or the like, and we will of course not do that. You send such a request to us by email, post or similar.

For natural reasons, we have to store, process and move your data. Your information is stored until further notice. You give us permission to store, process and move your data, as well as to send you offers and the like by email, letter and the like, and tell others that you are customer. Due to the way it works with software, permission also needs to be given to other parties. The permission is therefore granted to us, as well as to the companies and/or person(s) who own the software, the source code, the website and the like. It is also given to current and future companies owned and/or controlled by one or more of those who currently own and/or control us. It is also given to current and future companies owned and/or controlled by one or more of those who currently own and/or control the companies (if any), which own or will own the software, source code, website and the like. It is also given to current and future persons (if any) who own or will own the software, source code, website and the like. This applies both to current and future products and services. It is also given to another company, (like K-Soft Sverige AB), which we can use to send/sell products, upgrades and the like, either by intermediation or otherwise.

You of course have the right to request access to, change and deletion of the information we hold about you. You also have the right to request restriction of data processing, and to object to data processing and the right to data portability. You have the right to complain to the supervisory authority. You can find more legal information about us here. The laws of Ireland are the applicable laws. Placing an order is of course completely voluntary. Of course, we do not use any automated profiling or decisions.

If you wish to contact us, please use the information on this website.

Click on Invoice Now to register according to the information you have entered and the terms here. (Date and time of admission are entered automatically in our registers.)

Our experience is that our customers are very satisfied with the way we work and hope and believe that this will also be your experience.

Have a great day!', 'terms');

-- Insert Pricelist translations (Swedish)
INSERT INTO translations (key, language, value, page) VALUES
('pricelist.title', 'sv', 'Prislista', 'pricelist'),
('pricelist.search_article', 'sv', 'Sök artikelnummer...', 'pricelist'),
('pricelist.search_product', 'sv', 'Sök produkt...', 'pricelist'),
('pricelist.new_product', 'sv', 'Ny produkt', 'pricelist'),
('pricelist.print', 'sv', 'Skriv ut lista', 'pricelist'),
('pricelist.advanced', 'sv', 'Avancerat läge', 'pricelist'),
('pricelist.article_no', 'sv', 'Artikelnummer', 'pricelist'),
('pricelist.product_service', 'sv', 'Produkt/Tjänst', 'pricelist'),
('pricelist.in_price', 'sv', 'Inköpspris', 'pricelist'),
('pricelist.price', 'sv', 'Pris', 'pricelist'),
('pricelist.unit', 'sv', 'Enhet', 'pricelist'),
('pricelist.in_stock', 'sv', 'I lager', 'pricelist'),
('pricelist.description', 'sv', 'Beskrivning', 'pricelist');

-- Insert Pricelist translations (English)
INSERT INTO translations (key, language, value, page) VALUES
('pricelist.title', 'en', 'Pricelist', 'pricelist'),
('pricelist.search_article', 'en', 'Search Article No...', 'pricelist'),
('pricelist.search_product', 'en', 'Search Product...', 'pricelist'),
('pricelist.new_product', 'en', 'New Product', 'pricelist'),
('pricelist.print', 'en', 'Print List', 'pricelist'),
('pricelist.advanced', 'en', 'Advanced mode', 'pricelist'),
('pricelist.article_no', 'en', 'Article No.', 'pricelist'),
('pricelist.product_service', 'en', 'Product/Service', 'pricelist'),
('pricelist.in_price', 'en', 'In Price', 'pricelist'),
('pricelist.price', 'en', 'Price', 'pricelist'),
('pricelist.unit', 'en', 'Unit', 'pricelist'),
('pricelist.in_stock', 'en', 'In Stock', 'pricelist'),
('pricelist.description', 'en', 'Description', 'pricelist');

-- Insert sample products (25 products)
INSERT INTO products (article_no, name, description, in_price, price, unit, in_stock, vat_rate, account) VALUES
('ART001', 'Web Development', 'Custom web development services', 500.00, 800.00, 'h', 0, 25.00, '3000'),
('ART002', 'Consulting', 'Business consulting services', 600.00, 1000.00, 'h', 0, 25.00, '3001'),
('ART003', 'Design Services', 'Graphic and UI/UX design', 400.00, 700.00, 'h', 0, 25.00, '3002'),
('ART004', 'Hosting', 'Web hosting services', 50.00, 100.00, 'm', 0, 25.00, '3003'),
('ART005', 'Domain Registration', 'Domain name registration', 10.00, 20.00, 'st', 0, 25.00, '3004'),
('ART006', 'SSL Certificate', 'SSL certificate installation', 30.00, 60.00, 'st', 0, 25.00, '3005'),
('ART007', 'Email Setup', 'Email account configuration', 25.00, 50.00, 'st', 0, 25.00, '3006'),
('ART008', 'SEO Services', 'Search engine optimization', 800.00, 1200.00, 'm', 0, 25.00, '3007'),
('ART009', 'Content Writing', 'Content creation and copywriting', 200.00, 400.00, 'h', 0, 25.00, '3008'),
('ART010', 'Social Media Management', 'Social media content and management', 500.00, 900.00, 'm', 0, 25.00, '3009'),
('ART011', 'Photography', 'Professional photography services', 300.00, 600.00, 'h', 0, 25.00, '3010'),
('ART012', 'Video Production', 'Video editing and production', 400.00, 800.00, 'h', 0, 25.00, '3011'),
('ART013', 'Print Design', 'Print material design', 250.00, 500.00, 'h', 0, 25.00, '3012'),
('ART014', 'Branding', 'Complete branding package', 2000.00, 3500.00, 'st', 0, 25.00, '3013'),
('ART015', 'Logo Design', 'Logo design services', 500.00, 1000.00, 'st', 0, 25.00, '3014'),
('ART016', 'Maintenance', 'Website maintenance and updates', 100.00, 200.00, 'h', 0, 25.00, '3015'),
('ART017', 'Training', 'Staff training sessions', 150.00, 300.00, 'h', 0, 25.00, '3016'),
('ART018', 'Support', 'Technical support services', 80.00, 150.00, 'h', 0, 25.00, '3017'),
('ART019', 'Backup Services', 'Data backup solutions', 40.00, 80.00, 'm', 0, 25.00, '3018'),
('ART020', 'Security Audit', 'Security assessment and audit', 1000.00, 1800.00, 'st', 0, 25.00, '3019'),
('ART021', 'Mobile App Development', 'iOS and Android app development', 1500.00, 2500.00, 'h', 0, 25.00, '3020'),
('ART022', 'API Development', 'RESTful API development', 600.00, 1000.00, 'h', 0, 25.00, '3021'),
('ART023', 'Database Design', 'Database schema and optimization', 500.00, 900.00, 'h', 0, 25.00, '3022'),
('ART024', 'Cloud Migration', 'Cloud infrastructure migration', 2000.00, 3500.00, 'st', 0, 25.00, '3023'),
('ART025', 'Performance Optimization', 'Website performance tuning', 400.00, 750.00, 'h', 0, 25.00, '3024');

