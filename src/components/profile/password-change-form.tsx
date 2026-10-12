export function PasswordChangeForm() {
  return (
    <form className="card form-panel">
      <h2>Change password</h2>
      <div className="form-group">
        <label htmlFor="current-password">Current password</label>
        <input id="current-password" name="currentPassword" type="password" autoComplete="current-password" />
      </div>
      <div className="form-group">
        <label htmlFor="new-password">New password</label>
        <input id="new-password" name="newPassword" type="password" autoComplete="new-password" />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Update password
        </button>
      </div>
    </form>
  );
}
