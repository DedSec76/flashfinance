export function ProfileForm() {
  return (
    <form className="card form-panel">
      <h2>Profile details</h2>
      <div className="form-group">
        <label htmlFor="profile-name">Name</label>
        <input id="profile-name" name="name" type="text" autoComplete="name" />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save profile
        </button>
      </div>
    </form>
  );
}
