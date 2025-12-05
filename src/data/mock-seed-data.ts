import { ProductType, Role } from "@prisma/client";

export const mockData = {
    admins: [
        {
            name: "Kuzzi",
            email: "kuzzi@halalimeat.co.ke",
            password: "Kuzzi123!",
            role: Role.ADMIN,
        },
        {
            name: "Frank",
            email: "frank@halalimeat.co.ke",
            password: "Frank123!",
            role: Role.ADMIN,
        },
        {
            name: "Halali Admin 3",
            email: "admin3@halalimeat.co.ke",
            password: "Admin123!",
            role: Role.ADMIN,
        },
    ],

    products: [
        {
            name: "Beef Brisket",
            description:
                "Tender, flavorful beef brisket cut from locally raised halal-certified cattle.",
            price: 1200,
            category: "Beef",
            type: ProductType.CHILLED,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/beef-brisket.jpg",
        },
        {
            name: "Lamb Leg",
            description: "Fresh lamb leg perfect for roasts and stews.",
            price: 950,
            category: "Lamb",
            type: ProductType.FROZEN,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/lamb-leg.jpg",
        },
        {
            name: "Goat Shoulder",
            description: "Tender goat shoulder, ideal for stews and curries.",
            price: 850,
            category: "Goat",
            type: ProductType.CHILLED,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/goat-shoulder.jpg",
        },
        {
            name: "Mutton Ribs",
            description:
                "Delicious mutton ribs, excellent for grilling or braising.",
            price: 900,
            category: "Mutton",
            type: ProductType.FROZEN,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/mutton-ribs.jpg",
        },
        {
            name: "Whole Chicken",
            description: "Farm-fresh whole chicken, ready for roasting.",
            price: 600,
            category: "Poultry",
            type: ProductType.CHILLED,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/whole-chicken.jpg",
        },
        {
            name: "Beef Sirloin Steak",
            description: "Premium cut sirloin steak, perfect for grilling.",
            price: 1500,
            category: "Beef",
            type: ProductType.FROZEN,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/beef-sirloin.jpg",
        },
        {
            name: "Lamb Chops",
            description: "Juicy and tender lamb chops, ideal for pan-searing.",
            price: 1100,
            category: "Lamb",
            type: ProductType.CHILLED,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/lamb-chops.jpg",
        },
        {
            name: "Goat Leg",
            description: "A whole leg of goat, perfect for slow roasting.",
            price: 800,
            category: "Goat",
            type: ProductType.FROZEN,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/goat-leg.jpg",
        },
        {
            name: "Chicken Wings",
            description: "Fresh and meaty chicken wings, great for appetizers.",
            price: 450,
            category: "Poultry",
            type: ProductType.CHILLED,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/chicken-wings.jpg",
        },
        {
            name: "Beef Mince",
            description: "Lean beef mince, versatile for various dishes.",
            price: 700,
            category: "Beef",
            type: ProductType.FROZEN,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/beef-mince.jpg",
        },
        {
            name: "Lamb Shoulder",
            description: "Flavorful lamb shoulder, perfect for slow cooking.",
            price: 900,
            category: "Lamb",
            type: ProductType.CHILLED,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/lamb-shoulder.jpg",
        },
        {
            name: "Goat Mince",
            description:
                "Lean and healthy goat mince for your favorite recipes.",
            price: 650,
            category: "Goat",
            type: ProductType.FROZEN,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/goat-mince.jpg",
        },
        {
            name: "Chicken Breast",
            description: "Boneless, skinless chicken breast, a healthy choice.",
            price: 550,
            category: "Poultry",
            type: ProductType.CHILLED,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/chicken-breast.jpg",
        },
        {
            name: "Beef Ribs",
            description: "Meaty beef ribs, perfect for BBQ.",
            price: 1300,
            category: "Beef",
            type: ProductType.FROZEN,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/beef-ribs.jpg",
        },
        {
            name: "Lamb Shanks",
            description: "Hearty lamb shanks, ideal for slow cooking.",
            price: 1000,
            category: "Lamb",
            type: ProductType.CHILLED,
            imageUrl:
                "https://res.cloudinary.com/halalimeat/image/upload/v1/halali-meat/products/lamb-shanks.jpg",
        },
    ],

    quotes: [
        {
            name: "John Doe",
            email: "john@example.com",
            phone: "+254712345678",
            message: "Requesting a quote for 10kg of lamb leg.",
        },
        {
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+254723456789",
            message: "I need a quote for 50kg of beef brisket for an event.",
        },
        {
            name: "Peter Jones",
            email: "peter@example.com",
            phone: "+254734567890",
            message: "Please provide a quote for 20 whole chickens.",
        },
        {
            name: "Mary Williams",
            email: "mary@example.com",
            phone: "+254745678901",
            message:
                "I'm interested in a regular supply of goat meat. Can we discuss pricing?",
        },
        {
            name: "David Brown",
            email: "david@example.com",
            phone: "+254756789012",
            message: "Quote for 100kg of beef mince, please.",
        },
        {
            name: "Susan Davis",
            email: "susan@example.com",
            phone: "+254767890123",
            message: "I need 30 lamb shanks for my restaurant.",
        },
        {
            name: "Michael Miller",
            email: "michael@example.com",
            phone: "+254778901234",
            message: "What's your best price for 200kg of chicken wings?",
        },
        {
            name: "Linda Wilson",
            email: "linda@example.com",
            phone: "+254789012345",
            message:
                "I'm looking for a supplier of mutton ribs. Can you send me your catalog?",
        },
        {
            name: "Robert Moore",
            email: "robert@example.com",
            phone: "+254790123456",
            message: "Quote for 5 goat legs, please.",
        },
        {
            name: "Patricia Taylor",
            email: "patricia@example.com",
            phone: "+254701234567",
            message: "I need 10kg of beef sirloin steak for a party.",
        },
        {
            name: "James Anderson",
            email: "james@example.com",
            phone: "+254712345678",
            message: "Can I get a quote for 15kg of lamb chops?",
        },
        {
            name: "Barbara Thomas",
            email: "barbara@example.com",
            phone: "+254723456789",
            message:
                "I'm interested in your goat mince. What's the minimum order quantity?",
        },
        {
            name: "William Jackson",
            email: "william@example.com",
            phone: "+254734567890",
            message: "Please provide a quote for 25kg of chicken breast.",
        },
        {
            name: "Elizabeth White",
            email: "elizabeth@example.com",
            phone: "+254745678901",
            message: "I need a quote for 5 racks of beef ribs.",
        },
        {
            name: "Richard Harris",
            email: "richard@example.com",
            phone: "+254756789012",
            message:
                "I'm looking for a supplier of lamb shoulder. Can you provide pricing?",
        },
    ],

    messages: [
        {
            name: "Mary Wanjiru",
            email: "mary@example.com",
            subject: "Halal certification inquiry",
            body: "Hello, I would like to know more about your certification process.",
        },
        {
            name: "John Otieno",
            email: "john.o@example.com",
            subject: "Delivery to Mombasa",
            body: "Do you offer delivery services to Mombasa? What are the charges?",
        },
        {
            name: "Fatuma Ahmed",
            email: "fatuma.a@example.com",
            subject: "Bulk order discount",
            body: "I'm planning to make a large order. Do you offer any discounts for bulk purchases?",
        },
        {
            name: "David Kimani",
            email: "david.k@example.com",
            subject: "Packaging information",
            body: "How is the meat packaged? Is it vacuum-sealed?",
        },
        {
            name: "Grace Njeri",
            email: "grace.n@example.com",
            subject: "Payment methods",
            body: "What payment methods do you accept? Do you take M-Pesa?",
        },
        {
            name: "Samuel Mwangi",
            email: "samuel.m@example.com",
            subject: "Sourcing of animals",
            body: "Where do you source your animals from? Are they free-range?",
        },
        {
            name: "Aisha Mohammed",
            email: "aisha.m@example.com",
            subject: "International shipping",
            body: "I'm interested in shipping to Dubai. Can you provide more information on the logistics?",
        },
        {
            name: "Peter Omondi",
            email: "peter.o@example.com",
            subject: "Product availability",
            body: "Are all the products listed on your website always in stock?",
        },
        {
            name: "Esther Wambui",
            email: "esther.w@example.com",
            subject: "Visiting your facility",
            body: "Is it possible to visit your processing facility? I would like to see the operations.",
        },
        {
            name: "Ali Hassan",
            email: "ali.h@example.com",
            subject: "Feedback on my last order",
            body: "I was very impressed with the quality of the meat from my last order. Keep up the good work!",
        },
        {
            name: "Brenda Cherono",
            email: "brenda.c@example.com",
            subject: "Question about your beef products",
            body: "What is the difference between your brisket and sirloin steak?",
        },
        {
            name: "Kevin Ochieng",
            email: "kevin.o@example.com",
            subject: "Request for a price list",
            body: "Could you please send me a full price list of all your products?",
        },
        {
            name: "Nancy Muthoni",
            email: "nancy.m@example.com",
            subject: "Follow up on my quote request",
            body: "I submitted a quote request a few days ago and haven't heard back. Can you please check on it?",
        },
        {
            name: "Brian Kiprop",
            email: "brian.k@example.com",
            subject: "Custom cuts of meat",
            body: "Do you offer custom cuts of meat? I have specific requirements for my restaurant.",
        },
        {
            name: "Cynthia Achieng",
            email: "cynthia.a@example.com",
            subject: "Job opportunities",
            body: "Are you currently hiring? I'm interested in working for your company.",
        },
    ],

    sentMessages: [
        {
            name: "Kuzzi",
            email: "mary@example.com",
            subject: "Re: Halal certification inquiry",
            body: "Thank you for your inquiry. Our halal certification process involves strict adherence to Islamic dietary laws, overseen by certified authorities. We ensure all our products meet the highest standards. Please visit our 'Halal Standards' page for more details or contact us directly for specific questions.",
            type: "OUTBOUND",
            status: "READ",
        },
        {
            name: "Kuzzi",
            email: "john.o@example.com",
            subject: "Re: Delivery to Mombasa",
            body: "Yes, we offer delivery services to Mombasa. The charges depend on the order size and urgency. Please provide your order details, and we will give you an accurate quote for delivery.",
            type: "OUTBOUND",
            status: "READ",
        },
        {
            name: "Kuzzi",
            email: "fatuma.a@example.com",
            subject: "Re: Bulk order discount",
            body: "We do offer discounts for bulk purchases. The discount rate varies based on the volume of your order. Please share your requirements, and our sales team will prepare a customized offer for you.",
            type: "OUTBOUND",
            status: "READ",
        },
        {
            name: "Kuzzi",
            email: "david.k@example.com",
            subject: "Re: Packaging information",
            body: "Our meat products are typically vacuum-sealed to ensure freshness and extend shelf life. We also use insulated packaging for chilled and frozen items during transit. If you have specific packaging needs, please let us know.",
            type: "OUTBOUND",
            status: "READ",
        },
        {
            name: "Kuzzi",
            email: "grace.n@example.com",
            subject: "Re: Payment methods",
            body: "We accept various payment methods, including bank transfers and major credit/debit cards. Yes, we also accept M-Pesa for local transactions. Please specify your preferred payment method when placing your order.",
            type: "OUTBOUND",
            status: "READ",
        },
        {
            name: "Kuzzi",
            email: "samuel.m@example.com",
            subject: "Re: Sourcing of animals",
            body: "We source our animals from trusted local farms that adhere to ethical and humane practices. Our animals are free-range and raised without hormones or unnecessary antibiotics, ensuring high-quality and healthy meat.",
            type: "OUTBOUND",
            status: "READ",
        },
        {
            name: "Kuzzi",
            email: "aisha.m@example.com",
            subject: "Re: International shipping",
            body: "We specialize in international shipping, including to Dubai. We handle all logistics, customs documentation, and ensure proper cold chain management to deliver your order fresh and on time. Please contact our export team for a detailed consultation.",
            type: "OUTBOUND",
            status: "READ",
        },
        {
            name: "Kuzzi",
            email: "peter.o@example.com",
            subject: "Re: Product availability",
            body: "While we strive to keep all products in stock, availability can vary due to demand and seasonal factors. We recommend checking our website or contacting us directly for real-time stock information on specific products.",
            type: "OUTBOUND",
            status: "READ",
        },
        {
            name: "Kuzzi",
            email: "esther.w@example.com",
            subject: "Re: Visiting your facility",
            body: "Yes, we welcome visitors to our processing facility by appointment. This allows us to ensure proper safety protocols and provide you with a comprehensive tour. Please contact us to schedule your visit.",
            type: "OUTBOUND",
            status: "READ",
        },
        {
            name: "Kuzzi",
            email: "ali.h@example.com",
            subject: "Re: Feedback on my last order",
            body: "Thank you for your wonderful feedback, Ali! We are delighted to hear that you were impressed with the quality of your last order. We continuously strive to provide the best halal meat products and appreciate your kind words. We look forward to serving you again soon!",
            type: "OUTBOUND",
            status: "READ",
        },
    ],

    archivedMessages: [
        {
            name: "Archived User 1",
            email: "archived1@example.com",
            subject: "Archived Inquiry 1",
            body: "This is an archived message body 1.",
            type: "INBOUND",
            status: "ARCHIVED",
        },
        {
            name: "Archived User 2",
            email: "archived2@example.com",
            subject: "Archived Inquiry 2",
            body: "This is an archived message body 2.",
            type: "INBOUND",
            status: "ARCHIVED",
        },
        {
            name: "Archived User 3",
            email: "archived3@example.com",
            subject: "Archived Inquiry 3",
            body: "This is an archived message body 3.",
            type: "INBOUND",
            status: "ARCHIVED",
        },
        {
            name: "Archived User 4",
            email: "archived4@example.com",
            subject: "Archived Inquiry 4",
            body: "This is an archived message body 4.",
            type: "INBOUND",
            status: "ARCHIVED",
        },
        {
            name: "Archived User 5",
            email: "archived5@example.com",
            subject: "Archived Inquiry 5",
            body: "This is an archived message body 5.",
            type: "INBOUND",
            status: "ARCHIVED",
        },
        {
            name: "Archived User 6",
            email: "archived6@example.com",
            subject: "Archived Inquiry 6",
            body: "This is an archived message body 6.",
            type: "INBOUND",
            status: "ARCHIVED",
        },
        {
            name: "Archived User 7",
            email: "archived7@example.com",
            subject: "Archived Inquiry 7",
            body: "This is an archived message body 7.",
            type: "INBOUND",
            status: "ARCHIVED",
        },
        {
            name: "Archived User 8",
            email: "archived8@example.com",
            subject: "Archived Inquiry 8",
            body: "This is an archived message body 8.",
            type: "INBOUND",
            status: "ARCHIVED",
        },
        {
            name: "Archived User 9",
            email: "archived9@example.com",
            subject: "Archived Inquiry 9",
            body: "This is an archived message body 9.",
            type: "INBOUND",
            status: "ARCHIVED",
        },
        {
            name: "Archived User 10",
            email: "archived10@example.com",
            subject: "Archived Inquiry 10",
            body: "This is an archived message body 10.",
            type: "INBOUND",
            status: "ARCHIVED",
        },
    ],

    trashMessages: [
        {
            name: "Trash User 1",
            email: "trash1@example.com",
            subject: "Trash Inquiry 1",
            body: "This is a trash message body 1.",
            type: "INBOUND",
            status: "TRASH",
        },
        {
            name: "Trash User 2",
            email: "trash2@example.com",
            subject: "Trash Inquiry 2",
            body: "This is a trash message body 2.",
            type: "INBOUND",
            status: "TRASH",
        },
        {
            name: "Trash User 3",
            email: "trash3@example.com",
            subject: "Trash Inquiry 3",
            body: "This is a trash message body 3.",
            type: "INBOUND",
            status: "TRASH",
        },
        {
            name: "Trash User 4",
            email: "trash4@example.com",
            subject: "Trash Inquiry 4",
            body: "This is a trash message body 4.",
            type: "INBOUND",
            status: "TRASH",
        },
        {
            name: "Trash User 5",
            email: "trash5@example.com",
            subject: "Trash Inquiry 5",
            body: "This is a trash message body 5.",
            type: "INBOUND",
            status: "TRASH",
        },
    ],
};



