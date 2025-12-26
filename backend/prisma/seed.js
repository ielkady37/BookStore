const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Configuration
const CONFIG = {
  categories: ["Science", "Art", "Religion", "History", "Geography"],
  numPublishers: 15,
  numAuthors: 30,
  numBooks: 50,
  numUsers: 20,
  numCustomerOrders: 30,
  numPublisherOrders: 10,
};

// Helper to generate a valid ISBN-13
function generateISBN() {
  const prefix = "978";
  const group = faker.string.numeric(1);
  const publisher = faker.string.numeric(4);
  const title = faker.string.numeric(4);
  const base = prefix + group + publisher + title;

  // Calculate check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(base[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  return base + checkDigit;
}

// Helper to get random items from an array
function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

async function seedCategories() {
  console.log("🌱 Seeding categories...");

  for (const name of CONFIG.categories) {
    await prisma.categories.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  return await prisma.categories.findMany();
}

async function seedPublishers() {
  console.log("🌱 Seeding publishers...");

  const publishers = [];
  for (let i = 0; i < CONFIG.numPublishers; i++) {
    const publisher = await prisma.publisher.create({
      data: {
        name: faker.company.name() + " Publishing",
        address: faker.location.streetAddress({ useFullAddress: true }),
        phone: faker.phone.number({ style: "national" }),
      },
    });
    publishers.push(publisher);
  }

  return publishers;
}

async function seedAuthors() {
  console.log("🌱 Seeding authors...");

  const authors = [];
  for (let i = 0; i < CONFIG.numAuthors; i++) {
    const author = await prisma.authors.create({
      data: {
        name: faker.person.fullName(),
      },
    });
    authors.push(author);
  }

  return authors;
}

async function seedBooks(publishers, categories, authors) {
  console.log("🌱 Seeding books...");

  const books = [];
  const usedISBNs = new Set();

  for (let i = 0; i < CONFIG.numBooks; i++) {
    let isbn;
    do {
      isbn = generateISBN();
    } while (usedISBNs.has(isbn));
    usedISBNs.add(isbn);

    const publisher = faker.helpers.arrayElement(publishers);
    const category = faker.helpers.arrayElement(categories);
    const bookAuthors = getRandomItems(authors, faker.number.int({ min: 1, max: 3 }));

    const book = await prisma.books.create({
      data: {
        isbn,
        title: faker.lorem.words({ min: 2, max: 6 }),
        publication_year: faker.number.int({ min: 1990, max: 2024 }),
        price: parseFloat(faker.commerce.price({ min: 9.99, max: 99.99 })),
        publisher_id: publisher.publisher_id,
        category_id: category.category_id,
        book_authors: {
          create: bookAuthors.map((author) => ({
            author_id: author.author_id,
          })),
        },
        stock: {
          create: {
            quantity: faker.number.int({ min: 0, max: 100 }),
            threshold: faker.number.int({ min: 5, max: 20 }),
          },
        },
      },
    });

    books.push(book);
  }

  return books;
}

async function seedUsers() {
  console.log("🌱 Seeding users...");

  const users = [];
  const hashedPassword = await bcrypt.hash("password123", 12);

  // Create admin user
  const admin = await prisma.users.create({
    data: {
      username: "admin",
      password_hash: hashedPassword,
      role: "ADMIN",
      first_name: "Admin",
      last_name: "User",
      email: "admin@bookstore.com",
      phone: faker.phone.number({ style: "national" }),
      shipping_address: faker.location.streetAddress({ useFullAddress: true }),
    },
  });
  users.push(admin);

  // Create customer users
  for (let i = 0; i < CONFIG.numUsers - 1; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user = await prisma.users.create({
      data: {
        username: faker.internet.username({ firstName, lastName }).toLowerCase(),
        password_hash: hashedPassword,
        role: "CUSTOMER",
        first_name: firstName,
        last_name: lastName,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        phone: faker.phone.number({ style: "national" }),
        shipping_address: faker.location.streetAddress({ useFullAddress: true }),
      },
    });
    users.push(user);
  }

  return users;
}

async function seedCarts(users, books) {
  console.log("🌱 Seeding carts...");

  const customers = users.filter((u) => u.role === "CUSTOMER");

  for (const customer of customers) {
    // 50% chance of having a cart with items
    if (faker.datatype.boolean()) {
      const cartBooks = getRandomItems(books, faker.number.int({ min: 1, max: 5 }));

      await prisma.cart.create({
        data: {
          user_id: customer.user_id,
          cart_items: {
            create: cartBooks.map((book) => ({
              isbn: book.isbn,
              quantity: faker.number.int({ min: 1, max: 3 }),
            })),
          },
        },
      });
    }
  }
}

async function seedCustomerOrders(users, books) {
  console.log("🌱 Seeding customer orders...");

  const customers = users.filter((u) => u.role === "CUSTOMER");

  for (let i = 0; i < CONFIG.numCustomerOrders; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const orderBooks = getRandomItems(books, faker.number.int({ min: 1, max: 5 }));

    const items = orderBooks.map((book) => ({
      isbn: book.isbn,
      quantity: faker.number.int({ min: 1, max: 3 }),
      price: book.price,
    }));

    const totalPrice = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    const order = await prisma.customer_order.create({
      data: {
        user_id: customer.user_id,
        total_price: totalPrice,
        order_date: faker.date.past({ years: 1 }),
        customer_order_items: {
          create: items,
        },
      },
    });

    // Create payment for the order
    await prisma.payments.create({
      data: {
        order_id: order.order_id,
        credit_card_number: faker.finance.creditCardNumber("################"),
        expiry_date: faker.date.future({ years: 3 }),
        payment_status: faker.helpers.arrayElement(["SUCCESS", "SUCCESS", "SUCCESS", "FAILED"]),
      },
    });
  }
}

async function seedPublisherOrders(publishers, books) {
  console.log("🌱 Seeding publisher orders...");

  for (let i = 0; i < CONFIG.numPublisherOrders; i++) {
    const publisher = faker.helpers.arrayElement(publishers);

    // Get books from this publisher
    const publisherBooks = books.filter((b) => b.publisher_id === publisher.publisher_id);
    if (publisherBooks.length === 0) continue;

    const orderBooks = getRandomItems(
      publisherBooks,
      faker.number.int({ min: 1, max: Math.min(3, publisherBooks.length) })
    );

    await prisma.publisher_orders.create({
      data: {
        publisher_id: publisher.publisher_id,
        order_date: faker.date.past({ years: 1 }),
        status: faker.helpers.arrayElement(["PENDING", "CONFIRMED"]),
        publisher_order_items: {
          create: orderBooks.map((book) => ({
            isbn: book.isbn,
            quantity: faker.number.int({ min: 10, max: 100 }),
          })),
        },
      },
    });
  }
}

async function main() {
  console.log("🚀 Starting database seeding...\n");

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log("🧹 Clearing existing data...");
    await prisma.payments.deleteMany();
    await prisma.customer_order_items.deleteMany();
    await prisma.customer_order.deleteMany();
    await prisma.cart_items.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.publisher_order_items.deleteMany();
    await prisma.publisher_orders.deleteMany();
    await prisma.stock.deleteMany();
    await prisma.book_authors.deleteMany();
    await prisma.books.deleteMany();
    await prisma.authors.deleteMany();
    await prisma.publisher.deleteMany();
    await prisma.users.deleteMany();
    // Don't delete categories as they're predefined

    // Seed data
    const categories = await seedCategories();
    const publishers = await seedPublishers();
    const authors = await seedAuthors();
    const books = await seedBooks(publishers, categories, authors);
    const users = await seedUsers();
    await seedCarts(users, books);
    await seedCustomerOrders(users, books);
    await seedPublisherOrders(publishers, books);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Publishers: ${publishers.length}`);
    console.log(`   - Authors: ${authors.length}`);
    console.log(`   - Books: ${books.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`\n🔑 Admin credentials: admin / password123`);
    console.log(`🔑 Customer password: password123`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
