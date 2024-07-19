const text = `We are honored to have the opportunity to serve you.

As you review this quotation, please know that our team is dedicated to providing you with the highest quality products and exceptional customer service. We look forward to the possibility of working together to bring your vision to life.
  
Thank you again for choosing Railingo PVT Ltd. We are here to assist you every step of the way.`;

const accountDetails = [
  { label: "Account Name:", value: "Railingo Private Limited" },
  { label: "Bank Name:", value: "ICICI Bank" },
  { label: "Account Number:", value: "777705403240" },
  { label: "IFSC Code:", value: "ICIC0000436" },
];

const terms = [
  "The quotation is valid for a period of 10 days from the date of issuance, unless otherwise stated. Railingo reserves the right to revise the quotation after the expiry of the validity period.",
  "Payment shall be made by the Client to Railingo in accordance with the payment terms specified in the quotation.",
  "Railingo will use reasonable efforts to meet the agreed delivery timelines, but delays may occur due to unforeseen circumstances. Railingo shall not be liable for any damages or losses arising from such delays.",
  "Railingo warrants that the services will be performed with reasonable care and skill. However, Railingo does not warrant that the services will be error-free or uninterrupted.",
  "Railingo shall not be liable for any indirect, incidental, consequential, or special damages, even if advised of the possibility of such damages.",
  "Railingo agrees to keep confidential all information disclosed by the Client in connection with the services. The Client agrees to keep confidential all information disclosed by Railingo in connection with the services.",
  "Railingo shall not be liable for any delay or failure to perform its obligations under these Terms due to causes beyond its reasonable control, including, but not limited to, acts of God, natural disasters, war, terrorism, labor disputes, and government regulations.",
  "After the product is installed, the responsibility for packing will not lie with the company's team. Any packing required will be done by the client, and if the client requests packing after installation, it will incur additional charges.",
  "We shall not be responsible for any damage/breakage of materials once installed at site.",
  "Any cutting/repair of R.C.C. stone or brick work, flooring or plastering etc, for fixing the frame is not in our work scope.",
  "When transporting goods, if there is any dent or damage during transit, it will be covered only if there is insurance; otherwise, it will remain the client's responsibility.",
  "The provision of electricity and other necessary facilities should be provided from Client's side to the team.",
];

module.exports = { text, accountDetails, terms };
