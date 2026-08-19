import LegalPage, { LegalSection } from './LegalPage';

export default function TermsAndConditions() {
  return (
    <LegalPage title="Terms & Conditions" updated="18 August 2026">
      <p>
        These Terms & Conditions govern your use of the XIT Token website, dApp, referral program, and related services. By creating an account, connecting a wallet, buying XIT, or joining a plan, you agree to these terms. This page uses mock content for the public site and is not legal advice.
      </p>

      <LegalSection title="1. About XIT Token">
        <p>
          XIT is a utility token on BNB Smart Chain (BEP-20). It is intended for ecosystem access, participation, and planned utilities (staking, governance, payments). XIT does not represent equity, a security, or any guaranteed income, profit, or return.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <ul className="list-disc pl-5 space-y-1">
          <li>You must be at least 18 years old and legally able to use crypto services in your country.</li>
          <li>You are responsible for complying with local laws, taxes, and any restrictions on MLM or digital assets.</li>
          <li>New accounts may remain “Pending Activation” until a platform admin approves them.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Accounts & Referral Codes">
        <p>
          You must provide accurate registration details and a valid referral code where required. You receive a unique referral link. You must not create fake accounts, self-refer, or manipulate the 15-level network. We may suspend accounts that violate these rules.
        </p>
      </LegalSection>

      <LegalSection title="4. Compensation Plan">
        <p>
          Referral commissions are paid when members in your 15-level downline purchase tokens, at published rates (example: Level 1 = 5%, decreasing to Level 15 = 0.1%; total across levels 16.9%). Commissions are calculated automatically. Rates, eligibility, and distribution rules may be updated in the whitepaper or dApp notices.
        </p>
      </LegalSection>

      <LegalSection title="5. Investment Plans">
        <ul className="list-disc pl-5 space-y-1">
          <li>Lock Plan: illustrative 3X return, 0.82% daily ROI, tokens locked (admin-set period, typically 365 days). Tokens are not sellable during lock.</li>
          <li>Flexible Plan: illustrative 2X return, 0.53% daily ROI, 80% sellable and 20% locked.</li>
          <li>Minimum investment example: 100 XIT. ROI, if any, is claimed per platform rules and is not guaranteed.</li>
        </ul>
        <p>
          Displayed ROI and multipliers are mock / informational figures for the website. Digital assets are volatile. You may lose some or all of your tokens.
        </p>
      </LegalSection>

      <LegalSection title="6. Non-Custodial Service">
        <p>
          The platform does not hold your private keys. You control your wallet. Smart contract interactions are irreversible once confirmed on-chain. We are not liable for lost keys, phishing, or transactions you authorize.
        </p>
      </LegalSection>

      <LegalSection title="7. Prohibited Use">
        <ul className="list-disc pl-5 space-y-1">
          <li>Money laundering, fraud, or any illegal activity.</li>
          <li>Attacking, scraping, or reverse-engineering the dApp or contracts without authorization.</li>
          <li>Misrepresenting XIT as a guaranteed investment or bank product.</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. No Financial Advice">
        <p>
          Website content, whitepaper, roadmap, and compensation tables are for information only. Nothing here is financial, legal, or tax advice. Participate only with funds you can afford to lose.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, XIT Token, its team, and affiliates are not liable for indirect, incidental, or consequential losses, including token price changes, network fees, downtime, or smart-contract risk. The service is provided “as is”.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes">
        <p>
          We may update these Terms, tokenomics, or plan rules. Continued use after changes means you accept the updated Terms. Material updates will be dated at the top of this page.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          Questions: support@xittoken.com. Phone (mock): +1 (555) 000-0000. Support hours: 24/7 online platform; email replies typically within 24 hours.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
