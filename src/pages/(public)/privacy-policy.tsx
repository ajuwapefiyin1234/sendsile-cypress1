import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#F8F3F0] w-full min-h-screen">
      <div className="pb-[186px] w-full max-w-[754px] mx-auto">
        <PageTitle date="Last updated: July 4th, 2024" title="Privacy Policy" />
        <article className="pt-8">
          <Heading>Introduction</Heading>
          <Paragraph>
            At Sendsile, we value your privacy and are committed to protecting your personal
            information. This Privacy Policy explains how we collect, use, and secure your data when
            you use our services, including grocery delivery, bill payment, and donations.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Information We Collect</Heading>
          <ul className="pt-2 list-outside list-disc pl-7 space-y-2">
            <li>
              <TextDesc
                title="Personal Information: "
                desc="We collect personal information such as name, email address, phone number, postal address, and payment details."
              />
            </li>
            <li>
              <TextDesc
                title="Service-Specific Information: "
                desc="We collect information related to your use of our services, including orders, delivery address, payment details, utility provider details, and transaction history. "
              />
            </li>
            <li>
              <TextDesc
                title="Usage Data: "
                desc="We collect data on how you interact with our website and services, including IP address, browser type, operating system, referring URLs, page views, and clickstream data. "
              />
            </li>
            <li>
              <TextDesc
                title="Cookies and Tracking Technologies: "
                desc="We use cookies and similar technologies to enhance your experience on our website. "
              />
            </li>
          </ul>
        </article>
        <article className="pt-8">
          <Heading>How We Use Your Information </Heading>
          <ul className="pt-2 list-outside list-disc pl-7 space-y-2">
            <li>
              <TextDesc
                title="Service Provision: "
                desc="We use your personal information to provide and manage our services, process transactions, and communicate with you about your account and our offerings."
              />
            </li>
            <li>
              <TextDesc
                title="Improvement and Personalization: "
                desc="We analyse usage data to improve our website and services, customise your user experience, and develop new features. "
              />
            </li>
            <li>
              <TextDesc
                title="Communication: "
                desc="We may use your contact information to send you updates, promotional materials, and other information related to our services. "
              />
            </li>
            <li>
              <TextDesc
                title="Security and Fraud Prevention: "
                desc="We use your information to protect our services and users from fraud, abuse, and other harmful activities. "
              />
            </li>
          </ul>
        </article>
        <article className="pt-8">
          <Heading>Information Sharing and Disclosure </Heading>
          <ul className="pt-2 list-outside list-disc pl-7 space-y-2">
            <li>
              <TextDesc
                title="Third-Party Service Providers: "
                desc="We may share your information with trusted third-party service providers who assist us in operating our website, conducting business, and servicing you. "
              />
            </li>
            <li>
              <TextDesc
                title="Legal Requirements: "
                desc="We may disclose your information if required to do so by law or in response to valid requests by public authorities. "
              />
            </li>
            <li>
              <TextDesc
                title="Business Transfers: "
                desc="In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the new owner. "
              />
            </li>
          </ul>
        </article>
        <article className="pt-8">
          <Heading>Data Security</Heading>
          <Paragraph>
            We implement various security measures to protect your personal information from
            unauthorised access, use, or disclosure, including encryption, access controls, and
            secure data storage.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Your Rights and Choices </Heading>
          <ul className="pt-2 list-outside list-disc pl-7 space-y-2">
            <li>
              <TextDesc
                title="Access and Correction: "
                desc="You have the right to access and update your personal information. You can do this by logging to your account or contact us directly."
              />
            </li>
            <li>
              <TextDesc
                title="Data Deletion: "
                desc="You can request the deletion of your personal information, subject to certain legal obligations. "
              />
            </li>
            <li>
              <TextDesc
                title="Opt-Out: "
                desc="You can opt-out of receiving promotional communications from us. "
              />
            </li>
            <li>
              <TextDesc
                title="Cookie Preferences: "
                desc="You can opt-out of receiving promotional communications from us. "
              />
            </li>
          </ul>
        </article>
        <article className="pt-8">
          <Heading>Changes to This Privacy Policy</Heading>
          <Paragraph>
            We may update this Privacy Policy from time to time to reflect changes in our practices
            or legal requirements. We will notify you of any significant changes by posting the new
            policy on our website and updating the effective date.
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

export default PrivacyPolicy;

export const PageTitle = ({ title, date }: { title: string; date: string }) => {
  return (
    <div className="pt-[136px]">
      <h1 className="text-[70px] leading-[84px] text-prm-black font-normal">{title}</h1>
      <p className="pt-2 text-[17px] leading-6 text-[#36454F]">{date}</p>
    </div>
  );
};

export const Paragraph = ({
  children,
  link,
  to,
}: {
  children: string;
  link?: string;
  to?: string;
}) => {
  return (
    <p className="pt-2 text-[#36454F] text-lg leading-7 font-normal">
      {children}
      {link && (
        <Link to={to!} className="text-prm-red">
          {link}
        </Link>
      )}
      .
    </p>
  );
};

export const Heading = ({ children }: { children: string }) => {
  return <h1 className="text-prm-black text-[26px] leading-9 font-normal">{children}</h1>;
};

export const TextDesc = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <h1 className="text-lg leading-7 text-[#36454F] font-medium">
      {title}
      <span className="text-lg leading-7 text-[#36454F] font-normal">{desc}</span>
    </h1>
  );
};
