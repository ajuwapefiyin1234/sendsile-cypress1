import { Heading, PageTitle, Paragraph, TextDesc } from './privacy-policy';

const CookieNotice = () => {
  return (
    <div className="bg-[#F8F3F0] w-full min-h-screen">
      <div className="pb-[186px] w-full max-w-[754px] mx-auto">
        <PageTitle date="Last updated: July 4th, 2024" title="Cookie Notice" />
        <article className="pt-8">
          <Heading>About This Notice</Heading>
          <Paragraph>
            This Cookie Notice provides information on how Sendsile uses cookies when you visit our
            website or mobile applications. Any personal data provided to or collected by Sendsile
            via cookies and other tracking technologies is controlled by Sendsile. Kindly
            familiarise yourself with our cookie practices.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Cookies and How We Use Them</Heading>
          <Paragraph>
            A cookie is a small file of letters and numbers that websites send to your browser,
            which is stored on your device. Cookies allow us to distinguish you from other users,
            providing an enhanced browsing experience. We use cookies for the following purposes:
          </Paragraph>
          <ul className="pt-2 list-outside list-disc pl-7 space-y-2">
            <li>
              <TextDesc
                title="Visitor Analytics: "
                desc="Recognizing and counting visitors, and seeing how they navigate our site and apps, to improve functionality."
              />
            </li>
            <li>
              <TextDesc
                title="Preferences: "
                desc="Identifying your preferences, such as language settings, saved items, and subscriptions."
              />
            </li>
            <li>
              <TextDesc
                title="Targeted Messages: "
                desc="Sending newsletters and advertising messages tailored to your interests."
              />
            </li>
          </ul>
          <Paragraph>
            Our approved third parties may also set cookies when you use our services, including
            search engines, analytics providers, social media networks, and advertising companies.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Cookie Preferences</Heading>
          <Paragraph>
            We use technology such as cookies to collect information and store your online
            preferences. You can manage your cookie preferences to enable or disable specific types
            of cookies:
          </Paragraph>
          <ul className="pt-2 list-outside list-disc pl-7 space-y-2">
            <li>
              <TextDesc
                title="Strictly Necessary Cookies: "
                desc="These cookies are essential for website functionality and cannot be disabled."
              />
            </li>
            <li>
              <TextDesc
                title="Analytics Cookies: "
                desc="These cookies help us understand how you use the site, improving its efficiency and your experience."
              />
            </li>
            <li>
              <TextDesc
                title="Functional Cookies: "
                desc="These cookies remember your choices and provide enhanced features."
              />
            </li>
            <li>
              <TextDesc
                title="Targeting Cookies: "
                desc="These cookies track your site usage to make our content and advertising more relevant to your interests."
              />
            </li>
            <li>
              <TextDesc
                title="Third Party Cookies: "
                desc="Set by third parties providing services to us or you, such as tailored advertising and analytics."
              />
            </li>
          </ul>
        </article>

        <article className="pt-8">
          <Heading>Consent</Heading>
          <Paragraph>
            Before placing cookies on your device, we will show a prompt requesting your consent. By
            consenting, you enable us to provide the best possible experience. You may deny consent
            (except for strictly necessary cookies); however, some site features may not function
            fully. You can also manage cookies through your browser settings.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Managing Cookies</Heading>
          <Paragraph>
            You can enable or disable cookies in your internet browser settings. Most browsers
            accept cookies by default, but you can change this. Consult your browser&apos;s help
            menu or your device&apos;s documentation for more details.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Changes to This Policy</Heading>
          <Paragraph>
            We may update this Cookie Policy periodically. Changes will be highlighted at the top of
            this page and will become binding upon your first use of our site after the changes are
            made. Please check this page regularly.
          </Paragraph>
        </article>
        <article className="pt-8">
          <Heading>Further Information </Heading>
          <Paragraph link=" team@sendsile.com." to="mailto:team@sendsile.com">
            For more information on how we process your personal data or to exercise your legal
            rights, please contact us at
          </Paragraph>
        </article>
      </div>
    </div>
  );
};

export default CookieNotice;
