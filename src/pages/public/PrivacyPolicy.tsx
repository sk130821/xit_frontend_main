import LegalPage, { LegalSection } from './LegalPage';

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" updated="18 August 2026">
      <p>
        This Privacy Policy explains how XIT Token (“XIT”, “we”, “us”) collects, uses and protects information when you visit xittoken.com, create an account, connect a wallet, or use the XIT dApp, referral program, or investment plans. This is mock informational content for the public website and does not replace a lawyer-reviewed policy.
      </p>

      <LegalSection title="1. Information We Collect">
        <p>We may collect the following categories of data:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account details: name, email address, password hash, and unique referral code.</li>
          <li>Wallet data: BEP-20 compatible wallet address you connect to the dApp.</li>
          <li>Network activity: upline/downline referral relationships across 15 levels.</li>
          <li>Transaction records: token purchases, Lock Plan / Flexible Plan investments, ROI claims, and commission credits.</li>
          <li>Technical data: IP address, browser type, device, and pages visited.</li>
          <li>Support messages sent through the Contact form.</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How We Use Your Information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To create and activate your XIT account (admin activation may be required).</li>
          <li>To calculate and credit 15-level referral commissions on token purchases.</li>
          <li>To operate Lock (3X) and Flexible (2X) plans, including daily ROI tracking.</li>
          <li>To display on-chain and dashboard statistics you request.</li>
          <li>To send service emails such as login alerts, plan updates, and support replies.</li>
          <li>To detect fraud, abuse, or unauthorized access.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Blockchain Transparency">
        <p>
          XIT is a BEP-20 token on BNB Smart Chain. Wallet addresses and on-chain transfers are public by design. We cannot delete or alter blockchain records. Off-chain account data (email, referral tree) is stored in our application database.
        </p>
      </LegalSection>

      <LegalSection title="4. Sharing of Data">
        <p>
          We do not sell personal data. We may share limited information with: infrastructure providers (hosting, email), blockchain networks, independent auditors, and authorities if required by law. Referral relationships are visible to you inside the Network dashboard according to platform rules.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies & Analytics">
        <p>
          The website may use essential cookies for login sessions (JWT) and optional analytics to improve performance. You can control cookies in your browser. Disabling essential cookies may prevent login.
        </p>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <p>
          Account and transaction history is kept while your account is active and for a reasonable period afterward for compliance, dispute handling, and audit trails. Mock retention period: 7 years for financial-style records, or sooner if you request deletion where legally possible.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights">
        <p>
          Subject to applicable law, you may request access, correction, or deletion of off-chain personal data by emailing support@xittoken.com. Wallet transactions on BNB Smart Chain cannot be erased. We may retain records needed to operate commissions, ROI, and security.
        </p>
      </LegalSection>

      <LegalSection title="8. Security">
        <p>
          We use encrypted password storage, JWT authentication, and a non-custodial design — the platform does not take possession of your private keys. You are responsible for keeping your wallet seed phrase and login credentials secret.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact">
        <p>
          Privacy questions: support@xittoken.com. Operations: Dubai (global community). We aim to reply within 24 hours on business days.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
