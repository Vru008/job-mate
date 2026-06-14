import React, { useEffect, useState } from "react";
import { adminUsers, adminUpdateUser, adminDeleteUser } from "../../api/admin";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

const ROLE_CLASS = { seeker: "r-seeker", recruiter: "r-recruiter", admin: "r-admin" };

function EditUserModal({ user, onClose, onSaved, isSelf }) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [company, setCompany] = useState(user.company || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await adminUpdateUser(user._id, { name, role, company });
      onSaved(updated);
    } catch (err) {
      setError(err.response?.data?.error || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ad-overlay" onClick={onClose}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal-head">
          <strong>Edit user</strong>
          <button className="ad-close" onClick={onClose}>✕</button>
        </div>

        <label className="ad-mlabel">Name</label>
        <input className="ad-input" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="ad-mlabel">Email</label>
        <input className="ad-input ad-input-disabled" value={user.email} disabled />

        <label className="ad-mlabel">Role</label>
        <select
          className="ad-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isSelf}
        >
          <option value="seeker">seeker</option>
          <option value="recruiter">recruiter</option>
          <option value="admin">admin</option>
        </select>
        {isSelf && <p className="ad-hint">You can't change your own role.</p>}

        {role === "recruiter" && (
          <>
            <label className="ad-mlabel">Company</label>
            <input className="ad-input" value={company} onChange={(e) => setCompany(e.target.value)} />
          </>
        )}

        {error && <p className="ad-merror">{error}</p>}

        <div className="ad-modal-actions">
          <button className="ad-mbtn ghost" onClick={onClose}>Cancel</button>
          <button className="ad-mbtn primary" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    adminUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name} (${u.role}) and all their data?`)) return;
    try {
      await adminDeleteUser(u._id);
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
    } catch (err) {
      alert(err.response?.data?.error || "Could not delete user");
    }
  };

  const onSaved = (updated) => {
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
    setEditing(null);
  };

  return (
    <div className="ad-page">
      <div className="ad-header">
        <h1>Users</h1>
        <p className="ad-sub">{users.length} accounts on the platform.</p>
      </div>

      {loading ? (
        <p className="ad-empty">Loading users...</p>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`ad-role ${ROLE_CLASS[u.role]}`}>{u.role}</span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="ad-actions">
                    <button className="ad-edit" onClick={() => setEditing(u)}>Edit</button>
                    <button className="ad-del" onClick={() => remove(u)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditUserModal
          user={editing}
          isSelf={me?.id === editing._id}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}

export default AdminUsers;
