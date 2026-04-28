// Concept-grouped copy for TreePro — derived from the agency creative deck.
// Each "concept" maps to a section angle on the product page.

export interface CopyVariant { headline: string; primary: string; }
export interface ConceptBlock {
  id: string;
  title: string;
  angle: string;
  cta: string;
  variants: CopyVariant[];
}

export const TREEPRO_COPY: Record<string, ConceptBlock> = {
  speed: {
    id: "speed",
    title: "Quote it before you've finished your coffee",
    angle: "SPEED",
    cta: "Try it on your next job site",
    variants: [
      { headline: "Quote it before the kettle cools.", primary: "Standing under the tree. Phone in one hand, coffee in the other. Quote sent before they've stopped chatting." },
      { headline: "60-second quotes. From the ute.", primary: "Site photos, AS4373 line items, hazards. Tap, tap, send. Customer accepts. Deposit hits before you've reversed out." },
      { headline: "From driveway to deposit.", primary: "Quote, accept, deposit, scheduled — all before you leave the job site. No 9pm admin shift required." },
    ],
  },
  pain: {
    id: "pain",
    title: "Stop doing quotes at 9pm",
    angle: "PAIN POINT",
    cta: "End the 9pm admin shift",
    variants: [
      { headline: "Stop doing quotes at 9pm.", primary: "You did the work. You shouldn't have to spend the night doing the paperwork too. TreePro sends quotes from the site." },
      { headline: "Reclaim your evenings.", primary: "Kettle's on. Footy's on. And your last quote went out three hours ago — from the cab of the ute. Built for the field, not the kitchen table." },
      { headline: "Your laptop is not a job site.", primary: "Tradies who quote from site get paid 11 days faster on average. Move the admin where the work happens." },
    ],
  },
  customer: {
    id: "customer",
    title: "A quote your customer actually opens",
    angle: "CUSTOMER EXPERIENCE",
    cta: "See a sample quote",
    variants: [
      { headline: "Customers actually open these.", primary: "Your customer doesn't want a PDF from 'noreply@'. They want a link with photos of their trees and a green ACCEPT button. Tap rate vs PDFs: ~3×." },
      { headline: "Show, don't email.", primary: "Customers tap quotes that show their actual trees. They forget quotes that arrive as PDF attachments. ~3× tap rate. ~50% faster acceptance." },
      { headline: "Not a PDF. Not noreply@.", primary: "Branded link, photos of THEIR trees, accept/decline buttons, deposit handled. The quote your customer was actually waiting for." },
    ],
  },
  founder: {
    id: "founder",
    title: "Built by an arborist",
    angle: "FOUNDER · CREDIBILITY",
    cta: "Try it free",
    variants: [
      { headline: "Built by an arborist.", primary: "Built by someone who's been 15m up a Eucalypt with a rumbling chainsaw and a customer texting 'how much longer?' — not by someone who Googled 'tree CRM'." },
      { headline: "From the bucket, for the bucket.", primary: "TreePro was sketched on a phone halfway up a Spotted Gum. It still runs the same way — gloved-thumb friendly, every screen." },
      { headline: "An arborist's app.", primary: "Designed at a worksite, not a whiteboard. If a feature didn't survive a wet day in the bucket, it didn't ship." },
    ],
  },
  pipeline: {
    id: "pipeline",
    title: "From enquiry to paid in one app",
    angle: "PIPELINE",
    cta: "See the pipeline",
    variants: [
      { headline: "Enquiry to paid. One app.", primary: "Quote → schedule → job report → invoice → paid. No spreadsheet, no group SMS, no 'where did I write that down'." },
      { headline: "Quote. Job. Invoice. Paid.", primary: "Every job moves through four screens. Customers get updates automatically. You get paid before you've washed the chips off the boots." },
      { headline: "One pipeline. Not five.", primary: "Replace your paper, Excel, SMS, Tradify, and email-to-self with a single pipeline you can run from a phone." },
    ],
  },
  industry: {
    id: "industry",
    title: "For tree work, by tree work",
    angle: "INDUSTRY-SPECIFIC",
    cta: "Made for tree people",
    variants: [
      { headline: "Generic CRMs don't get EWPs.", primary: "Generic apps don't know what an EWP is, why heritage trees matter, or that crane work is $250/hr. TreePro does." },
      { headline: "AS4373 baked in.", primary: "Pre-loaded prune codes, hazard tags (powerlines, structures, heritage), and an equipment library priced in AUD. Built for our work." },
      { headline: "Built for tree work, full stop.", primary: "Stump grinders. Chippers. Cranes. EWPs. Cat 2 crews. Heritage tagging. The terms aren't in the help docs — they're in the buttons." },
    ],
  },
};

export const PIPELINE_STEPS = [
  { n: "01", label: "Quote", body: "Site photos, AS4373 line items, hazards. Tap-to-send. Customer gets a branded link with a green ACCEPT." },
  { n: "02", label: "Schedule", body: "They tap accept. Deposit captured, job dropped onto the right day, customer SMS'd. Crew + EWP booked in two taps." },
  { n: "03", label: "Job report", body: "Before / during / after / hazard / stump. Customer gets a clean job report. Review request fires automatically." },
  { n: "04", label: "Invoice", body: "Pulls from the accepted quote and the time on site. GST line items. AUD. One tap to send." },
  { n: "05", label: "Paid", body: "Card link in the customer's hand. Reminder fires at 7 days if they ghost. Free 14-day trial." },
];
