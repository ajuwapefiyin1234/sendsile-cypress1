import { Heading, PageTitle, Paragraph, TextDesc } from './privacy-policy';

const TermsOfService = () => {
  return (
    <div className="bg-[#F8F3F0] w-full min-h-screen">
      <div className="pb-[186px] w-full max-w-[754px] mx-auto">
        <PageTitle date="Last updated: July 4th, 2024" title="Terms of Service" />
        <article className="pt-8">
          <Paragraph>
            Welcome to Sendsile! These Terms of Service (&apos;Terms&apos;) govern your access to
            and use of our website and services, including grocery delivery, bill payment, and
            donations. By using our services, you agree to these Terms. Please read them carefully.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Acceptance of Terms </Heading>
          <Paragraph>
            By accessing or using the Sendsile website and services, you agree to be bound by these
            Terms, our Privacy Policy, and any other applicable policies. If you do not agree to
            these Terms, please do not use our services.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Eligibility </Heading>
          <Paragraph>
            Use of Sendsile.com is only available to individuals who can enter legally binding
            contracts under Nigerian law. Minors, defined as those under 18 years of age, are not
            eligible to register as members or use the website. If a minor wishes to use or transact
            on Sendsile.com, they may do so only through a legal guardian or parent who has
            registered as a user. Sendsile.com reserves the right to terminate membership and deny
            access to anyone found to be under 18 years old.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Account and Registration Obligations </Heading>
          <Paragraph>
            By using Sendsile.com, you agree to maintain the confidentiality of your User ID and
            Password and be responsible for all activities under your account. You warrant that your
            registration information is accurate and complete. Sendsile.com may suspend or terminate
            your account without notice if your information is found to be inaccurate or incomplete.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Services </Heading>
          <ul className="pt-2 list-outside list-disc pl-7 space-y-2">
            <li>
              <TextDesc
                title="Grocery Delivery: "
                desc="We offer grocery delivery services from local farmers and wholesalers to your doorstep. You agree to provide accurate delivery information and to be available to receive your order during the specified delivery time. "
              />
            </li>
            <li>
              <TextDesc
                title="Bill Payment: "
                desc="Our bill payment service allows you to pay for utilities, data recharges, and airtime top-ups. You are responsible for providing accurate billing information and ensuring sufficient funds for each transaction. "
              />
            </li>
            <li>
              <TextDesc
                title="Donations: "
                desc="You can make donations to support community improvement projects. By donating, you agree to provide accurate payment information and acknowledge that your donation is voluntary and non-refundable."
              />
            </li>
          </ul>
        </article>
        <article className="pt-8">
          <Heading>Payments and Fees </Heading>
          <Paragraph>
            You agree to pay all applicable fees and charges for the services you use. All payments
            must be made through the payment methods provided on our website. We reserve the right
            to change our fees at any time, with notice to you if required by law.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>User Conduct </Heading>
          <Paragraph>You agree not to:</Paragraph>
          <ul className="pt-2 list-outside list-disc pl-7 space-y-2">
            <li>
              <Paragraph>Use our services for any illegal or unauthorised purpose.</Paragraph>
            </li>
            <li>
              <Paragraph>Interfere with or disrupt the operation of our services.</Paragraph>
            </li>
            <li>
              <Paragraph>
                Access or attempt to access another user’s account without permission.
              </Paragraph>
            </li>
            <li>
              <Paragraph>Use our services to transmit harmful or malicious code.</Paragraph>
            </li>
            <li>
              <Paragraph>Violate any applicable laws or regulations.</Paragraph>
            </li>
          </ul>
        </article>
        <article className="pt-8">
          <Heading>Intellectual Property </Heading>
          <Paragraph>
            All content on the Sendsile website, including text, graphics, logos, and software, is
            the property of Sendsile or its licensors and is protected by intellectual property
            laws. You may not use, reproduce, or distribute any content from our website without our
            prior written permission.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Termination </Heading>
          <Paragraph>
            At Sendsile’s discretion and without prior notice to you, Sendsile may suspend or
            terminate your access to the Sendsile website.
          </Paragraph>
          <Paragraph>
            Upon any termination of your access to the website, you shall immediately cease all
            access to and use of the Sendsile Website and we shall, in addition to any other legal
            or equitable remedies, immediately revoke all password(s) and account identification
            issued to you and deny your access to and use of the website in whole or in part.
          </Paragraph>
          <Paragraph>
            If you are dissatisfied with the website or with any terms, conditions, rules, policies,
            guidelines, or practices of Sendsile in operating the website, your sole and exclusive
            remedy is to discontinue using the website.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Limitation of Liability </Heading>
          <Paragraph>
            To the fullest extent permitted by law, Sendsile.com shall not be liable for any
            indirect, consequential, or special damages. Our total liability to you or any third
            party shall be limited to an amount determined by us in our sole discretion.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Indemnity</Heading>
          <Paragraph>
            You agree to indemnify, defend, and hold harmless Sendsile and its affiliates, officers,
            employees, and agents from and against any and all claims, liabilities, damages, losses,
            and expenses, including reasonable attorneys&apos; fees, arising out of or in any way
            connected with your access to or use of our services or violation of these Terms.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Governing Law </Heading>
          <Paragraph>
            These Terms shall be governed by and construed in accordance with the laws of Nigeria
            without regard to its conflict of law principles. Any legal action or proceeding arising
            under these Terms shall be brought exclusively in the courts located in Nigeria, and you
            consent to the jurisdiction of such courts.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Changes to Terms </Heading>
          <Paragraph>
            We reserve the right to modify these Terms at any time. We will provide notice of any
            material changes by posting the new Terms on our website and updating the effective
            date. Your continued use of our services after any such changes constitutes your
            acceptance of the new Terms.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Contact Us </Heading>
          <Paragraph link=" team@sendsile.com" to="mailto:team@sendsile.com">
            If you have any questions or concerns about this Privacy Policy or our data practices,
            please contact us at
          </Paragraph>
        </article>
      </div>
    </div>
  );
};

export default TermsOfService;
