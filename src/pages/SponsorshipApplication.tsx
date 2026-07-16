import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, CheckCircle2, Copy, Languages } from "lucide-react";

const LANGUAGE_KEY = "hpg_sponsorship_application_language_v1";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]["code"];

type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    pageTitle: "Sponsorship Application",
    pageSubtitle: "Submit your organization's sponsorship request to HPG Development",
    language: "Language",
    organization: "Organization",
    request: "Request",
    impact: "Impact",
    links: "Links",
    review: "Review",
    organizationDetails: "Organization Details",
    organizationName: "Organization Name *",
    websiteOptional: "Website (optional)",
    websitePlaceholder: "https://... or social profile link",
    websiteHint: "If you do not have a website, paste a social profile link.",
    representativeName: "Representative Name *",
    representativeTitle: "Representative Title / Role",
    emailAddress: "Email Address *",
    phone: "Phone",
    location: "Location (City, State, Country)",
    einTaxId: "EIN / Tax ID (if applicable)",
    einHint: "If outside the U.S., you can leave this blank.",
    legalStatus: "Legal Status",
    countryRegistration: "Country of Registration",
    countryOperation: "Country of Operation",
    select: "Select...",
    sponsorshipRequest: "Sponsorship Request",
    selectSponsorshipModel: "Select Sponsorship Model *",
    modelHint: "This controls which fields appear below.",
    missionFocus: "Mission Focus *",
    numberProjects: "Number of Projects",
    totalAmount: "Total Amount Requested (USD)",
    overheadPerProject: "Estimated Overhead Per Project (USD)",
    donationPerProject: "Targeted Donation Per Project (USD)",
    timelineStart: "Timeline Start Date",
    timelineEnd: "Timeline End Date",
    projectExamples: "Project Examples",
    projectExamplesPlaceholder: "Separate multiple projects with bullet points.",
    eventDetails: "Event Sponsorship Details",
    eventDetailsPlaceholder: "Include date/location or add a deck link in the Links step.",
    inkindDetails: "In-kind Sponsorship Details",
    inkindDetailsPlaceholder: "List items and quantities, and provide an itemized doc link in Links.",
    communityImpact: "Community Impact",
    communityImpactQuestion: "How will your project impact the community? *",
    communityImpactPlaceholder: "Beneficiaries, frequency, outputs, and measurable indicators.",
    brandingMessage: "What is the branding message and vibe of your project? *",
    otherFunding: "What other funding sources have you secured?",
    supportingLinks: "Supporting Links & Preferences",
    proposalLink: "Proposal / Concept Note Link",
    proposalHint: "A short concept note is fine if you don't have a full proposal yet.",
    budgetLink: "Budget Link",
    deckLink: "Deck / Pitch Link",
    timezone: "Time Zone",
    timezonePlaceholder: "e.g. EST, WAT, GMT+3",
    preferredContact: "Preferred Contact Method",
    consent: "I consent to receive updates on the status of my application.",
    reviewConfirm: "Review & Confirm",
    reviewInstruction: "Submissions are reviewed by Development. You will receive a reference ID after submission.",
    website: "Website",
    representative: "Representative",
    title: "Title",
    registration: "Registration",
    operation: "Operation",
    model: "Model",
    projectCount: "# Projects",
    totalRequested: "Total Requested",
    timeline: "Timeline",
    brandingReview: "Branding Message",
    proposal: "Proposal Link",
    budget: "Budget Link",
    deck: "Deck Link",
    contactMethod: "Contact Method",
    back: "Back",
    next: "Next",
    submit: "Submit to HPG Development",
    applicationReceivedTitle: "Application Received",
    applicationReceivedBody: "Your sponsorship application was submitted successfully.",
    referenceId: "Reference ID:",
    followUp: "Include this reference ID if you follow up by email so Development can locate your submission.",
    done: "Done",
    toastReceivedTitle: "Application received!",
    toastReceivedBody: "Your sponsorship application has been submitted.",
    toastCopied: "Reference ID copied!",
    errOrgName: "Organization name is required.",
    errRepName: "Representative name is required.",
    errEmail: "Please enter a valid email.",
    errModel: "Please select a sponsorship model.",
    errMissionFocus: "Mission focus is required.",
    errCommunityImpact: "Please describe how your project impacts the community.",
    errBrandingMessage: "Please describe the branding message.",
    errConsent: "Consent is required to submit.",
  },
  fr: {
    pageTitle: "Demande de parrainage",
    pageSubtitle: "Soumettez la demande de parrainage de votre organisation au département Développement de HPG",
    language: "Langue",
    organization: "Organisation",
    request: "Demande",
    impact: "Impact",
    links: "Liens",
    review: "Révision",
    organizationDetails: "Détails de l’organisation",
    organizationName: "Nom de l’organisation *",
    websiteOptional: "Site Web (facultatif)",
    websitePlaceholder: "https://... ou lien vers un profil social",
    websiteHint: "Si vous n’avez pas de site Web, collez un lien vers un profil social.",
    representativeName: "Nom du représentant *",
    representativeTitle: "Titre / rôle du représentant",
    emailAddress: "Adresse e-mail *",
    phone: "Téléphone",
    location: "Lieu (ville, État/région, pays)",
    einTaxId: "EIN / identifiant fiscal (si applicable)",
    einHint: "Si vous êtes hors des États-Unis, vous pouvez laisser ce champ vide.",
    legalStatus: "Statut juridique",
    countryRegistration: "Pays d’enregistrement",
    countryOperation: "Pays d’activité",
    select: "Sélectionner...",
    sponsorshipRequest: "Demande de parrainage",
    selectSponsorshipModel: "Sélectionnez le modèle de parrainage *",
    modelHint: "Ce choix détermine les champs affichés ci-dessous.",
    missionFocus: "Axe de mission *",
    numberProjects: "Nombre de projets",
    totalAmount: "Montant total demandé (USD)",
    overheadPerProject: "Frais généraux estimés par projet (USD)",
    donationPerProject: "Don ciblé par projet (USD)",
    timelineStart: "Date de début",
    timelineEnd: "Date de fin",
    projectExamples: "Exemples de projets",
    projectExamplesPlaceholder: "Séparez plusieurs projets par des puces.",
    eventDetails: "Détails du parrainage d’événement",
    eventDetailsPlaceholder: "Ajoutez la date/le lieu ou un lien vers le dossier dans l’étape Liens.",
    inkindDetails: "Détails du parrainage en nature",
    inkindDetailsPlaceholder: "Listez les articles et quantités, puis fournissez un lien vers un document détaillé.",
    communityImpact: "Impact communautaire",
    communityImpactQuestion: "Comment votre projet aura-t-il un impact sur la communauté ? *",
    communityImpactPlaceholder: "Bénéficiaires, fréquence, résultats et indicateurs mesurables.",
    brandingMessage: "Quel est le message de marque et le ton de votre projet ? *",
    otherFunding: "Quelles autres sources de financement avez-vous obtenues ?",
    supportingLinks: "Liens justificatifs et préférences",
    proposalLink: "Lien vers la proposition / note conceptuelle",
    proposalHint: "Une courte note conceptuelle suffit si vous n’avez pas encore de proposition complète.",
    budgetLink: "Lien vers le budget",
    deckLink: "Lien vers le dossier / pitch deck",
    timezone: "Fuseau horaire",
    timezonePlaceholder: "ex. EST, WAT, GMT+3",
    preferredContact: "Méthode de contact préférée",
    consent: "J’accepte de recevoir des mises à jour sur le statut de ma demande.",
    reviewConfirm: "Réviser et confirmer",
    reviewInstruction: "Les demandes sont examinées par le département Développement. Vous recevrez un numéro de référence après l’envoi.",
    website: "Site Web",
    representative: "Représentant",
    title: "Titre",
    registration: "Enregistrement",
    operation: "Activité",
    model: "Modèle",
    projectCount: "Nombre de projets",
    totalRequested: "Total demandé",
    timeline: "Calendrier",
    brandingReview: "Message de marque",
    proposal: "Lien de proposition",
    budget: "Lien de budget",
    deck: "Lien du dossier",
    contactMethod: "Méthode de contact",
    back: "Retour",
    next: "Suivant",
    submit: "Soumettre au Développement HPG",
    applicationReceivedTitle: "Demande reçue",
    applicationReceivedBody: "Votre demande de parrainage a été soumise avec succès.",
    referenceId: "Numéro de référence :",
    followUp: "Incluez ce numéro de référence si vous faites un suivi par e-mail afin que le Développement puisse retrouver votre demande.",
    done: "Terminé",
    toastReceivedTitle: "Demande reçue !",
    toastReceivedBody: "Votre demande de parrainage a été soumise.",
    toastCopied: "Numéro de référence copié !",
    errOrgName: "Le nom de l’organisation est requis.",
    errRepName: "Le nom du représentant est requis.",
    errEmail: "Veuillez entrer une adresse e-mail valide.",
    errModel: "Veuillez sélectionner un modèle de parrainage.",
    errMissionFocus: "L’axe de mission est requis.",
    errCommunityImpact: "Veuillez décrire l’impact communautaire de votre projet.",
    errBrandingMessage: "Veuillez décrire le message de marque.",
    errConsent: "Le consentement est requis pour soumettre la demande.",
  },
  es: {
    pageTitle: "Solicitud de patrocinio",
    pageSubtitle: "Envíe la solicitud de patrocinio de su organización al Departamento de Desarrollo de HPG",
    language: "Idioma",
    organization: "Organización",
    request: "Solicitud",
    impact: "Impacto",
    links: "Enlaces",
    review: "Revisión",
    organizationDetails: "Datos de la organización",
    organizationName: "Nombre de la organización *",
    websiteOptional: "Sitio web (opcional)",
    websitePlaceholder: "https://... o enlace a perfil social",
    websiteHint: "Si no tiene sitio web, pegue un enlace a un perfil social.",
    representativeName: "Nombre del representante *",
    representativeTitle: "Título / rol del representante",
    emailAddress: "Correo electrónico *",
    phone: "Teléfono",
    location: "Ubicación (ciudad, estado/región, país)",
    einTaxId: "EIN / identificación fiscal (si aplica)",
    einHint: "Si está fuera de Estados Unidos, puede dejar este campo en blanco.",
    legalStatus: "Estatus legal",
    countryRegistration: "País de registro",
    countryOperation: "País de operación",
    select: "Seleccionar...",
    sponsorshipRequest: "Solicitud de patrocinio",
    selectSponsorshipModel: "Seleccione el modelo de patrocinio *",
    modelHint: "Esta selección controla qué campos aparecen abajo.",
    missionFocus: "Enfoque de la misión *",
    numberProjects: "Número de proyectos",
    totalAmount: "Monto total solicitado (USD)",
    overheadPerProject: "Gastos generales estimados por proyecto (USD)",
    donationPerProject: "Donación objetivo por proyecto (USD)",
    timelineStart: "Fecha de inicio",
    timelineEnd: "Fecha de finalización",
    projectExamples: "Ejemplos de proyectos",
    projectExamplesPlaceholder: "Separe varios proyectos con viñetas.",
    eventDetails: "Detalles del patrocinio de evento",
    eventDetailsPlaceholder: "Incluya fecha/ubicación o agregue un enlace al material en el paso de enlaces.",
    inkindDetails: "Detalles del patrocinio en especie",
    inkindDetailsPlaceholder: "Enumere artículos y cantidades, y proporcione un enlace a un documento detallado.",
    communityImpact: "Impacto comunitario",
    communityImpactQuestion: "¿Cómo impactará su proyecto a la comunidad? *",
    communityImpactPlaceholder: "Beneficiarios, frecuencia, resultados e indicadores medibles.",
    brandingMessage: "¿Cuál es el mensaje de marca y el tono de su proyecto? *",
    otherFunding: "¿Qué otras fuentes de financiamiento ha conseguido?",
    supportingLinks: "Enlaces de apoyo y preferencias",
    proposalLink: "Enlace a propuesta / nota conceptual",
    proposalHint: "Una nota conceptual breve es suficiente si aún no tiene una propuesta completa.",
    budgetLink: "Enlace al presupuesto",
    deckLink: "Enlace al deck / pitch",
    timezone: "Zona horaria",
    timezonePlaceholder: "ej. EST, WAT, GMT+3",
    preferredContact: "Método de contacto preferido",
    consent: "Acepto recibir actualizaciones sobre el estado de mi solicitud.",
    reviewConfirm: "Revisar y confirmar",
    reviewInstruction: "Las solicitudes son revisadas por Desarrollo. Recibirá un ID de referencia después del envío.",
    website: "Sitio web",
    representative: "Representante",
    title: "Título",
    registration: "Registro",
    operation: "Operación",
    model: "Modelo",
    projectCount: "N.º de proyectos",
    totalRequested: "Total solicitado",
    timeline: "Cronograma",
    brandingReview: "Mensaje de marca",
    proposal: "Enlace de propuesta",
    budget: "Enlace de presupuesto",
    deck: "Enlace del deck",
    contactMethod: "Método de contacto",
    back: "Atrás",
    next: "Siguiente",
    submit: "Enviar a Desarrollo HPG",
    applicationReceivedTitle: "Solicitud recibida",
    applicationReceivedBody: "Su solicitud de patrocinio se envió correctamente.",
    referenceId: "ID de referencia:",
    followUp: "Incluya este ID de referencia si hace seguimiento por correo electrónico para que Desarrollo pueda localizar su solicitud.",
    done: "Listo",
    toastReceivedTitle: "¡Solicitud recibida!",
    toastReceivedBody: "Su solicitud de patrocinio ha sido enviada.",
    toastCopied: "¡ID de referencia copiado!",
    errOrgName: "El nombre de la organización es obligatorio.",
    errRepName: "El nombre del representante es obligatorio.",
    errEmail: "Ingrese un correo electrónico válido.",
    errModel: "Seleccione un modelo de patrocinio.",
    errMissionFocus: "El enfoque de la misión es obligatorio.",
    errCommunityImpact: "Describa cómo su proyecto impacta a la comunidad.",
    errBrandingMessage: "Describa el mensaje de marca.",
    errConsent: "El consentimiento es obligatorio para enviar.",
  },
  ar: {
    pageTitle: "طلب الرعاية",
    pageSubtitle: "أرسل طلب الرعاية الخاص بمنظمتك إلى قسم التطوير في HPG",
    language: "اللغة",
    organization: "المنظمة",
    request: "الطلب",
    impact: "الأثر",
    links: "الروابط",
    review: "المراجعة",
    organizationDetails: "تفاصيل المنظمة",
    organizationName: "اسم المنظمة *",
    websiteOptional: "الموقع الإلكتروني (اختياري)",
    websitePlaceholder: "https://... أو رابط حساب اجتماعي",
    websiteHint: "إذا لم يكن لديك موقع إلكتروني، ضع رابط حساب اجتماعي.",
    representativeName: "اسم الممثل *",
    representativeTitle: "منصب / دور الممثل",
    emailAddress: "البريد الإلكتروني *",
    phone: "الهاتف",
    location: "الموقع (المدينة، الولاية/المنطقة، البلد)",
    einTaxId: "رقم EIN / الرقم الضريبي (إن وجد)",
    einHint: "إذا كنت خارج الولايات المتحدة، يمكنك ترك هذا الحقل فارغًا.",
    legalStatus: "الوضع القانوني",
    countryRegistration: "بلد التسجيل",
    countryOperation: "بلد العمل",
    select: "اختر...",
    sponsorshipRequest: "طلب الرعاية",
    selectSponsorshipModel: "اختر نموذج الرعاية *",
    modelHint: "هذا الاختيار يحدد الحقول التي ستظهر أدناه.",
    missionFocus: "محور الرسالة *",
    numberProjects: "عدد المشاريع",
    totalAmount: "إجمالي المبلغ المطلوب (بالدولار الأمريكي)",
    overheadPerProject: "المصاريف الإدارية المقدرة لكل مشروع (بالدولار الأمريكي)",
    donationPerProject: "التبرع المستهدف لكل مشروع (بالدولار الأمريكي)",
    timelineStart: "تاريخ البداية",
    timelineEnd: "تاريخ النهاية",
    projectExamples: "أمثلة المشاريع",
    projectExamplesPlaceholder: "افصل بين المشاريع المتعددة بنقاط.",
    eventDetails: "تفاصيل رعاية الحدث",
    eventDetailsPlaceholder: "أضف التاريخ/الموقع أو رابط العرض في خطوة الروابط.",
    inkindDetails: "تفاصيل الرعاية العينية",
    inkindDetailsPlaceholder: "اذكر العناصر والكميات، وأضف رابط مستند مفصل.",
    communityImpact: "الأثر المجتمعي",
    communityImpactQuestion: "كيف سيؤثر مشروعك في المجتمع؟ *",
    communityImpactPlaceholder: "المستفيدون، التكرار، المخرجات، والمؤشرات القابلة للقياس.",
    brandingMessage: "ما رسالة العلامة والطابع العام لمشروعك؟ *",
    otherFunding: "ما مصادر التمويل الأخرى التي حصلت عليها؟",
    supportingLinks: "روابط داعمة وتفضيلات",
    proposalLink: "رابط المقترح / المذكرة المفاهيمية",
    proposalHint: "تكفي مذكرة مفاهيمية قصيرة إذا لم يكن لديك مقترح كامل بعد.",
    budgetLink: "رابط الميزانية",
    deckLink: "رابط العرض / ملف التعريف",
    timezone: "المنطقة الزمنية",
    timezonePlaceholder: "مثال: EST أو WAT أو GMT+3",
    preferredContact: "طريقة التواصل المفضلة",
    consent: "أوافق على تلقي تحديثات حول حالة طلبي.",
    reviewConfirm: "مراجعة وتأكيد",
    reviewInstruction: "تتم مراجعة الطلبات بواسطة قسم التطوير. ستتلقى رقمًا مرجعيًا بعد الإرسال.",
    website: "الموقع الإلكتروني",
    representative: "الممثل",
    title: "المنصب",
    registration: "التسجيل",
    operation: "العمل",
    model: "النموذج",
    projectCount: "عدد المشاريع",
    totalRequested: "إجمالي المطلوب",
    timeline: "الجدول الزمني",
    brandingReview: "رسالة العلامة",
    proposal: "رابط المقترح",
    budget: "رابط الميزانية",
    deck: "رابط العرض",
    contactMethod: "طريقة التواصل",
    back: "رجوع",
    next: "التالي",
    submit: "إرسال إلى تطوير HPG",
    applicationReceivedTitle: "تم استلام الطلب",
    applicationReceivedBody: "تم إرسال طلب الرعاية بنجاح.",
    referenceId: "رقم المرجع:",
    followUp: "اذكر رقم المرجع هذا عند المتابعة عبر البريد الإلكتروني حتى يتمكن قسم التطوير من العثور على طلبك.",
    done: "تم",
    toastReceivedTitle: "تم استلام الطلب!",
    toastReceivedBody: "تم إرسال طلب الرعاية الخاص بك.",
    toastCopied: "تم نسخ رقم المرجع!",
    errOrgName: "اسم المنظمة مطلوب.",
    errRepName: "اسم الممثل مطلوب.",
    errEmail: "يرجى إدخال بريد إلكتروني صالح.",
    errModel: "يرجى اختيار نموذج الرعاية.",
    errMissionFocus: "محور الرسالة مطلوب.",
    errCommunityImpact: "يرجى وصف أثر مشروعك على المجتمع.",
    errBrandingMessage: "يرجى وصف رسالة العلامة.",
    errConsent: "الموافقة مطلوبة للإرسال.",
  },
} as const;

const legalStatuses = [
  "501(c)(3)",
  "Nonprofit pending",
  "International NGO",
  "Unincorporated initiative",
  "For-profit social enterprise",
  "Other",
] as const;

const sponsorshipModels = [
  "Project Sponsorship",
  "Fiscal Sponsorship (Type C)",
  "Event Sponsorship",
  "In-kind Sponsorship",
  "Other",
] as const;

const contactMethods = ["Email", "WhatsApp", "Zoom"] as const;

const optionTranslations: Record<LanguageCode, Record<string, string>> = {
  en: {},
  fr: {
    "501(c)(3)": "501(c)(3)",
    "Nonprofit pending": "Organisme sans but lucratif en attente",
    "International NGO": "ONG internationale",
    "Unincorporated initiative": "Initiative non constituée",
    "For-profit social enterprise": "Entreprise sociale à but lucratif",
    Other: "Autre",
    "Project Sponsorship": "Parrainage de projet",
    "Fiscal Sponsorship (Type C)": "Parrainage fiscal (Type C)",
    "Event Sponsorship": "Parrainage d’événement",
    "In-kind Sponsorship": "Parrainage en nature",
    Email: "E-mail",
    WhatsApp: "WhatsApp",
    Zoom: "Zoom",
  },
  es: {
    "501(c)(3)": "501(c)(3)",
    "Nonprofit pending": "Organización sin fines de lucro pendiente",
    "International NGO": "ONG internacional",
    "Unincorporated initiative": "Iniciativa no incorporada",
    "For-profit social enterprise": "Empresa social con fines de lucro",
    Other: "Otro",
    "Project Sponsorship": "Patrocinio de proyecto",
    "Fiscal Sponsorship (Type C)": "Patrocinio fiscal (Tipo C)",
    "Event Sponsorship": "Patrocinio de evento",
    "In-kind Sponsorship": "Patrocinio en especie",
    Email: "Correo electrónico",
    WhatsApp: "WhatsApp",
    Zoom: "Zoom",
  },
  ar: {
    "501(c)(3)": "501(c)(3)",
    "Nonprofit pending": "منظمة غير ربحية قيد الاعتماد",
    "International NGO": "منظمة غير حكومية دولية",
    "Unincorporated initiative": "مبادرة غير مسجلة",
    "For-profit social enterprise": "مؤسسة اجتماعية ربحية",
    Other: "أخرى",
    "Project Sponsorship": "رعاية مشروع",
    "Fiscal Sponsorship (Type C)": "رعاية مالية (النوع C)",
    "Event Sponsorship": "رعاية حدث",
    "In-kind Sponsorship": "رعاية عينية",
    Email: "البريد الإلكتروني",
    WhatsApp: "واتساب",
    Zoom: "زووم",
  },
};

interface FormData {
  orgName: string;
  website: string;
  repName: string;
  repTitle: string;
  email: string;
  phone: string;
  location: string;
  ein: string;
  legalStatus: string;
  countryRegistration: string;
  countryOperation: string;
  model: string;
  missionFocus: string;
  numProjects: string;
  totalAmount: string;
  overheadPerProject: string;
  donationPerProject: string;
  timelineStart: string;
  timelineEnd: string;
  projectExamples: string;
  eventDetails: string;
  inkindDetails: string;
  communityImpact: string;
  brandingMessage: string;
  otherFunding: string;
  proposalLink: string;
  budgetLink: string;
  deckLink: string;
  contactMethod: string;
  timezone: string;
  consent: boolean;
}

const emptyForm: FormData = {
  orgName: "",
  website: "",
  repName: "",
  repTitle: "",
  email: "",
  phone: "",
  location: "",
  ein: "",
  legalStatus: "",
  countryRegistration: "",
  countryOperation: "",
  model: "",
  missionFocus: "",
  numProjects: "",
  totalAmount: "",
  overheadPerProject: "",
  donationPerProject: "",
  timelineStart: "",
  timelineEnd: "",
  projectExamples: "",
  eventDetails: "",
  inkindDetails: "",
  communityImpact: "",
  brandingMessage: "",
  otherFunding: "",
  proposalLink: "",
  budgetLink: "",
  deckLink: "",
  contactMethod: "",
  timezone: "",
  consent: false,
};

function getInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem(LANGUAGE_KEY) as LanguageCode | null;
  if (saved && LANGUAGES.some((language) => language.code === saved)) return saved;
  const browserLanguage = navigator.language.slice(0, 2).toLowerCase() as LanguageCode;
  return LANGUAGES.some((language) => language.code === browserLanguage) ? browserLanguage : "en";
}

export default function SponsorshipApplication() {
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hp, setHp] = useState("");
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());
  const { toast } = useToast();


  const t = (key: TranslationKey) => translations[language][key] || translations.en[key];
  const optionLabel = (value: string) => optionTranslations[language][value] || value;
  const steps = [t("organization"), t("request"), t("impact"), t("links"), t("review")];
  const progress = ((step + 1) / steps.length) * 100;
  const isRtl = language === "ar";

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
  }, [language, isRtl]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-sm text-destructive">{errors[field]}</p>
    ) : null;

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};

    if (step === 0) {
      if (!form.orgName.trim()) errs.orgName = t("errOrgName");
      if (!form.repName.trim()) errs.repName = t("errRepName");
      const emailResult = z.string().email().safeParse(form.email);
      if (!emailResult.success) errs.email = t("errEmail");
    }

    if (step === 1) {
      if (!form.model) errs.model = t("errModel");
      if (!form.missionFocus.trim()) errs.missionFocus = t("errMissionFocus");
    }

    if (step === 2) {
      if (!form.communityImpact.trim()) errs.communityImpact = t("errCommunityImpact");
      if (!form.brandingMessage.trim()) errs.brandingMessage = t("errBrandingMessage");
    }

    if (step === 3) {
      if (!form.consent) errs.consent = t("errConsent");
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-sponsorship", {
        body: {
          organizationName: form.orgName,
          contactEmail: form.email,
          language,
          data: { ...form, language },
          _hp: hp,
          idempotencyKey: idempotencyKeyRef.current,
        },
      });
      if (error || !data?.success) {
        const msg = (data as { error?: string } | null)?.error || error?.message ||
          "We couldn't submit your application. Please try again.";
        setSubmitError(msg);
        toast({ title: "Submission failed", description: msg, variant: "destructive" });
        return;
      }
      setRefId(data.referenceId);
      setSubmitted(true);
      toast({ title: t("toastReceivedTitle"), description: `${t("toastReceivedBody")} — ${data.referenceId}` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setSubmitError(msg);
      toast({ title: "Submission failed", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };


  const copyRefId = () => {
    navigator.clipboard.writeText(refId);
    toast({ title: t("toastCopied") });
  };

  const LanguageSwitcher = () => (
    <div className="mb-8 flex justify-end">
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm shadow-sm">
        <Languages className="h-4 w-4 text-primary" />
        <Label htmlFor="language" className="sr-only">{t("language")}</Label>
        <span className="font-medium text-muted-foreground">{t("language")}</span>
        <Select value={language} onValueChange={(value) => setLanguage(value as LanguageCode)}>
          <SelectTrigger id="language" className="h-8 w-[145px] border-0 bg-transparent px-2 shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((languageOption) => (
              <SelectItem key={languageOption.code} value={languageOption.code}>
                {languageOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderOrganization = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">{t("organizationDetails")}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="orgName">{t("organizationName")}</Label>
          <Input id="orgName" value={form.orgName} onChange={(e) => set("orgName", e.target.value)} />
          <FieldError field="orgName" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website">{t("websiteOptional")}</Label>
          <Input id="website" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder={t("websitePlaceholder")} />
          <p className="text-xs text-muted-foreground">{t("websiteHint")}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="repName">{t("representativeName")}</Label>
          <Input id="repName" value={form.repName} onChange={(e) => set("repName", e.target.value)} />
          <FieldError field="repName" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="repTitle">{t("representativeTitle")}</Label>
          <Input id="repTitle" value={form.repTitle} onChange={(e) => set("repTitle", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("emailAddress")}</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          <FieldError field="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="location">{t("location")}</Label>
          <Input id="location" value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ein">{t("einTaxId")}</Label>
          <Input id="ein" value={form.ein} onChange={(e) => set("ein", e.target.value)} />
          <p className="text-xs text-muted-foreground">{t("einHint")}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>{t("legalStatus")}</Label>
          <Select value={form.legalStatus} onValueChange={(v) => set("legalStatus", v)}>
            <SelectTrigger><SelectValue placeholder={t("select")} /></SelectTrigger>
            <SelectContent>
              {legalStatuses.map((status) => (<SelectItem key={status} value={status}>{optionLabel(status)}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="countryRegistration">{t("countryRegistration")}</Label>
          <Input id="countryRegistration" value={form.countryRegistration} onChange={(e) => set("countryRegistration", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="countryOperation">{t("countryOperation")}</Label>
          <Input id="countryOperation" value={form.countryOperation} onChange={(e) => set("countryOperation", e.target.value)} />
        </div>
      </div>
    </div>
  );

  const renderRequest = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">{t("sponsorshipRequest")}</h3>

      <div className="space-y-1.5">
        <Label>{t("selectSponsorshipModel")}</Label>
        <Select value={form.model} onValueChange={(v) => set("model", v)}>
          <SelectTrigger><SelectValue placeholder={t("select")} /></SelectTrigger>
          <SelectContent>
            {sponsorshipModels.map((model) => (<SelectItem key={model} value={model}>{optionLabel(model)}</SelectItem>))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{t("modelHint")}</p>
        <FieldError field="model" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="missionFocus">{t("missionFocus")}</Label>
        <Input id="missionFocus" value={form.missionFocus} onChange={(e) => set("missionFocus", e.target.value)} />
        <FieldError field="missionFocus" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="numProjects">{t("numberProjects")}</Label>
          <Input id="numProjects" value={form.numProjects} onChange={(e) => set("numProjects", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="totalAmount">{t("totalAmount")}</Label>
          <Input id="totalAmount" value={form.totalAmount} onChange={(e) => set("totalAmount", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="overheadPerProject">{t("overheadPerProject")}</Label>
          <Input id="overheadPerProject" value={form.overheadPerProject} onChange={(e) => set("overheadPerProject", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="donationPerProject">{t("donationPerProject")}</Label>
          <Input id="donationPerProject" value={form.donationPerProject} onChange={(e) => set("donationPerProject", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="timelineStart">{t("timelineStart")}</Label>
          <Input id="timelineStart" type="date" value={form.timelineStart} onChange={(e) => set("timelineStart", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="timelineEnd">{t("timelineEnd")}</Label>
          <Input id="timelineEnd" type="date" value={form.timelineEnd} onChange={(e) => set("timelineEnd", e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="projectExamples">{t("projectExamples")}</Label>
        <Textarea id="projectExamples" value={form.projectExamples} onChange={(e) => set("projectExamples", e.target.value)} rows={4} maxLength={4000} placeholder={t("projectExamplesPlaceholder")} />
        <p className="text-xs text-muted-foreground text-right">{form.projectExamples.length} / 4000</p>
      </div>

      {form.model === "Event Sponsorship" && (
        <div className="space-y-1.5">
          <Label htmlFor="eventDetails">{t("eventDetails")}</Label>
          <Textarea id="eventDetails" value={form.eventDetails} onChange={(e) => set("eventDetails", e.target.value)} rows={3} placeholder={t("eventDetailsPlaceholder")} />
        </div>
      )}

      {form.model === "In-kind Sponsorship" && (
        <div className="space-y-1.5">
          <Label htmlFor="inkindDetails">{t("inkindDetails")}</Label>
          <Textarea id="inkindDetails" value={form.inkindDetails} onChange={(e) => set("inkindDetails", e.target.value)} rows={3} placeholder={t("inkindDetailsPlaceholder")} />
        </div>
      )}
    </div>
  );

  const renderImpact = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">{t("communityImpact")}</h3>

      <div className="space-y-1.5">
        <Label htmlFor="communityImpact">{t("communityImpactQuestion")}</Label>
        <Textarea id="communityImpact" value={form.communityImpact} onChange={(e) => set("communityImpact", e.target.value)} rows={6} maxLength={8000} placeholder={t("communityImpactPlaceholder")} />
        <p className="text-xs text-muted-foreground text-right">{form.communityImpact.length} / 8000</p>
        <FieldError field="communityImpact" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="brandingMessage">{t("brandingMessage")}</Label>
        <Textarea id="brandingMessage" value={form.brandingMessage} onChange={(e) => set("brandingMessage", e.target.value)} rows={4} maxLength={4000} />
        <p className="text-xs text-muted-foreground text-right">{form.brandingMessage.length} / 4000</p>
        <FieldError field="brandingMessage" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="otherFunding">{t("otherFunding")}</Label>
        <Textarea id="otherFunding" value={form.otherFunding} onChange={(e) => set("otherFunding", e.target.value)} rows={3} maxLength={4000} />
        <p className="text-xs text-muted-foreground text-right">{form.otherFunding.length} / 4000</p>
      </div>
    </div>
  );

  const renderLinks = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">{t("supportingLinks")}</h3>

      <div className="space-y-1.5">
        <Label htmlFor="proposalLink">{t("proposalLink")}</Label>
        <Input id="proposalLink" value={form.proposalLink} onChange={(e) => set("proposalLink", e.target.value)} placeholder="https://..." />
        <p className="text-xs text-muted-foreground">{t("proposalHint")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="budgetLink">{t("budgetLink")}</Label>
          <Input id="budgetLink" value={form.budgetLink} onChange={(e) => set("budgetLink", e.target.value)} placeholder="https://..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="deckLink">{t("deckLink")}</Label>
          <Input id="deckLink" value={form.deckLink} onChange={(e) => set("deckLink", e.target.value)} placeholder="https://..." />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>{t("preferredContact")}</Label>
          <Select value={form.contactMethod} onValueChange={(v) => set("contactMethod", v)}>
            <SelectTrigger><SelectValue placeholder={t("select")} /></SelectTrigger>
            <SelectContent>
              {contactMethods.map((method) => (<SelectItem key={method} value={method}>{optionLabel(method)}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="timezone">{t("timezone")}</Label>
          <Input id="timezone" value={form.timezone} onChange={(e) => set("timezone", e.target.value)} placeholder={t("timezonePlaceholder")} />
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <Checkbox checked={form.consent} onCheckedChange={(c) => set("consent", c === true)} className="mt-0.5" />
        <span>{t("consent")}</span>
      </label>
      <FieldError field="consent" />
    </div>
  );

  const renderReview = () => {
    const sections = [
      {
        title: t("organization"),
        rows: [
          [t("organization"), form.orgName],
          [t("website"), form.website || "—"],
          [t("representative"), form.repName],
          [t("title"), form.repTitle || "—"],
          [t("emailAddress"), form.email],
          [t("phone"), form.phone || "—"],
          [t("location"), form.location || "—"],
          ["EIN", form.ein || "—"],
          [t("legalStatus"), form.legalStatus ? optionLabel(form.legalStatus) : "—"],
          [t("registration"), form.countryRegistration || "—"],
          [t("operation"), form.countryOperation || "—"],
        ],
      },
      {
        title: t("request"),
        rows: [
          [t("model"), form.model ? optionLabel(form.model) : "—"],
          [t("missionFocus"), form.missionFocus],
          [t("projectCount"), form.numProjects || "—"],
          [t("totalRequested"), form.totalAmount || "—"],
          [t("timeline"), form.timelineStart && form.timelineEnd ? `${form.timelineStart} → ${form.timelineEnd}` : "—"],
          [t("projectExamples"), form.projectExamples || "—"],
        ],
      },
      {
        title: t("impact"),
        rows: [
          [t("communityImpact"), form.communityImpact],
          [t("brandingReview"), form.brandingMessage],
          [t("otherFunding"), form.otherFunding || "—"],
        ],
      },
      {
        title: t("links"),
        rows: [
          [t("proposal"), form.proposalLink || "—"],
          [t("budget"), form.budgetLink || "—"],
          [t("deck"), form.deckLink || "—"],
          [t("contactMethod"), form.contactMethod ? optionLabel(form.contactMethod) : "—"],
          [t("timezone"), form.timezone || "—"],
        ],
      },
    ];

    return (
      <div className="space-y-6">
        <h3 className="font-display text-xl font-semibold text-foreground">{t("reviewConfirm")}</h3>
        <p className="text-sm text-muted-foreground">{t("reviewInstruction")}</p>
        {sections.map((section) => (
          <div key={section.title} className="rounded-md border border-border p-4">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">{section.title}</h4>
            <dl className="space-y-2">
              {section.rows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-3 gap-2 text-sm">
                  <dt className="font-medium text-foreground">{label}</dt>
                  <dd className="col-span-2 text-muted-foreground break-words whitespace-pre-line">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
        <Navbar />
        <PageHero title={t("applicationReceivedTitle")} />
        <section className="mx-auto max-w-2xl px-4 py-20 text-center">
          <LanguageSwitcher />
          <CheckCircle2 className="mx-auto h-16 w-16 text-accent" />
          <h2 className="mt-6 font-display text-3xl font-semibold text-foreground">
            {t("applicationReceivedTitle")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("applicationReceivedBody")}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2 text-sm font-mono">
            <span className="text-muted-foreground">{t("referenceId")}</span>
            <span className="font-bold text-foreground">{refId}</span>
            <button onClick={copyRefId} className="text-primary hover:text-primary/80" aria-label={t("toastCopied")}>
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{t("followUp")}</p>
          <Button
            className="mt-8"
            onClick={() => {
              setForm(emptyForm);
              setStep(0);
              setSubmitted(false);
              setRefId("");
            }}
          >
            {t("done")}
          </Button>
        </section>
        <Footer />
      </div>
    );
  }

  const stepContent = [renderOrganization, renderRequest, renderImpact, renderLinks, renderReview];

  return (
    <div className="min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />
      <PageHero title={t("pageTitle")} subtitle={t("pageSubtitle")} />

      <section className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
        <LanguageSwitcher />

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="mt-3 flex justify-between gap-2">
            {steps.map((stepLabel, index) => (
              <button
                key={stepLabel}
                onClick={() => { if (index < step) setStep(index); }}
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                  index === step ? "text-primary" : index < step ? "text-accent cursor-pointer" : "text-muted-foreground"
                }`}
              >
                {stepLabel}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${language}-${step}`}
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 30 : -30 }}
            transition={{ duration: 0.25 }}
          >
            {stepContent[step]()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <Button variant="outline" onClick={back} disabled={step === 0} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> {t("back")}
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={next} className="gap-1">
              {t("next")} <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-1">
              <CheckCircle2 className="h-4 w-4" /> {t("submit")}
            </Button>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
