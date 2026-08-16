export default function Disclaimer() {
  return (
    <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm">
      <h3 className="font-bold text-amber-400 mb-3">
        ⚠ Important
      </h3>

      <ul className="space-y-2 muted">
        <li>
          <strong>Independent Project:</strong> This is a student-created
          project for informational and awareness purposes and is not an
          official RGIPT placement portal or institutional publication.
        </li>

        <li>
          <strong>Data Accuracy:</strong> Placement information is compiled
          from available sources and may contain errors, omissions, or
          outdated information. Please verify important details through
          official sources.
        </li>

        <li>
          <strong>Indicative Information:</strong> CTC, stipend, eligibility,
          role, location, and selection figures shown here are indicative
          and may be subject to change.
        </li>

        <li>
          <strong>Pending Results:</strong> A selection count marked as
          <strong> “Process Pending” </strong> indicates that the final
          outcome has not been confirmed or published.
        </li>

        <li>
          <strong>No Guarantee:</strong> Listing a company, role, or offer
          does not constitute an endorsement, guarantee of selection, or
          confirmation of employment.
        </li>

        <li>
          <strong>Good-Faith Use:</strong> This platform is intended solely
          for student reference and self-information and does not seek to
          misrepresent any individual, organization, or company.
        </li>
      </ul>
    </div>
  );
}