import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import StaffGlobe from "@/components/StaffGlobe";
import { motion } from "framer-motion";

const executiveCabinet = [
  {
    name: "Gilbert Foust",
    title: "Chief Executive Officer, Chairperson",
    img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_5059.JPG",
    bio: "Gilbert Foust earned an AA & BA in International Studies, and a MA in Professional Communications. His professional experience encompasses two decades of international community project development.",
  },
  {
    name: "Myron Mageto",
    title: "Chief Financial Officer, Executive VP, Treasurer",
    img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/81d90cd6-4fe5-46c4-8499-ff53bc54c9b7.jpg",
    bio: "Mr. Mageto attained a B.A. in Theological Studies and graduate studies in International Management. He made significant contributions to NATO and the U.S. Departments of State and Defense.",
  },
  {
    name: "Moreen C. Ronoh",
    title: "Chief Communications Officer, VP",
    img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/0001.jpg",
    bio: "Moreen is a passionate storyteller with experience in marketing and digital strategy. She is the founder of Unlimited Sis Initiative, dedicated to menstrual and mental health equity.",
  },
  {
    name: "Jimmy Shen",
    title: "Chief Technology Officer, VP",
    img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_9768.jpg",
    bio: "Jimmy Shen has a Masters in Computer Science and Electronics Engineering from Shanghai University. He oversees HPG IT sub-departments with over 40 specialists.",
  },
  {
    name: "Justina Chidinma Ubah",
    title: "General Counsel",
    img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/Untitled%20Project%20(2).png",
    bio: "Justina is a passionate legal professional specializing in family law and child welfare advocacy. A graduate of the University of Ilorin.",
  },
  {
    name: "Shawn McDonough",
    title: "Compliance Officer / Chief Program Officer",
    img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/unnamed.jpg",
    bio: "Shawn McDonough has over three decades of experience addressing complex business challenges on a global scale, with leadership roles across retail, IT, banking, automotive, and nonprofits.",
  },
];

const staff = [
  { name: "Amanda Emotoghan", title: "Chief Administrative Officer", dept: "Administration", country: "Nigeria" },
  { name: "Krisha Parekh", title: "Technology Research Specialist", dept: "Technology", country: "India" },
  { name: "William White", title: "Fundraising Director", dept: "Technology", country: "United States" },
  { name: "Refa Bethanic Gea Ananda", title: "Human Resources Specialist", dept: "Executive", country: "Indonesia" },
  { name: "Kadar Sheikhmous", title: "Fund Development Committee", dept: "Communications", country: "Syria" },
  { name: "Nyon Oozi Jackline", title: "Accountant", dept: "Finance", country: "Uganda" },
  { name: "James Miller", title: "Advisory Committee", dept: "Communications", country: "United States" },
  { name: "Kashish Tuteja", title: "Nominations Committee", dept: "Communications", country: "India" },
  { name: "Moreen", title: "Chief Communications Officer", dept: "Communications", country: "Kenya" },
  { name: "Josue Rios", title: "CMO", dept: "Communications", country: "Puerto Rico" },
  { name: "Kweku Quaye", title: "Financial Controller", dept: "Finance", country: "Canada / Ghana" },
  { name: "Christie Nelson", title: "CDO", dept: "Executive", country: "Canada" },
  { name: "David Nguyen", title: "Asia Regional Coordinator", dept: "Regional", country: "South Korea" },
  { name: "Gregorio Santi", title: "European Regional Coordinator", dept: "Regional", country: "Italy" },
  { name: "Maria Ramos", title: "Latin America Regional Coordinator", dept: "Regional", country: "Mexico" },
  { name: "Jane DeRosa", title: "Executive Assistant", dept: "Administration", country: "Puerto Rico" },
];

export default function HpgStaff() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="HPG Staff" subtitle="Meet the team driving our global mission" />

      {/* Executive Cabinet */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">Executive Cabinet</h2>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {executiveCabinet.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <img
                  src={person.img}
                  alt={person.name}
                  className="mx-auto h-48 w-48 rounded-full object-cover shadow-md"
                />
                <h3 className="mt-4 font-display text-xl font-bold text-foreground">{person.name}</h3>
                <p className="text-sm font-medium text-primary">{person.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{person.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Directory */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-foreground">Staff Directory</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {staff.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="rounded-lg bg-card p-4 shadow-sm"
              >
                <h4 className="font-display text-base font-bold text-foreground">{person.name}</h4>
                <p className="text-xs text-primary">{person.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{person.dept} · {person.country}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
