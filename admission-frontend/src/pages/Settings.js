import React, { useState } from "react";

function Settings() {
  const [systemName, setSystemName] = useState(
    "Admission Management System"
  );

  const [email, setEmail] = useState(
    "admin@college.edu"
  );

  const [notifications, setNotifications] = useState(
    true
  );

  const [darkMode, setDarkMode] = useState(false);

  const saveSettings = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div>

      <h1>⚙️ Settings</h1>

      <p style={styles.subtitle}>
        Manage your Admission Management System settings
      </p>

      {/* System Settings */}

      <div style={styles.card}>

        <h2>🏫 System Settings</h2>

        <div style={styles.formGroup}>
          <label>System Name</label>

          <input
            type="text"
            value={systemName}
            onChange={(e) =>
              setSystemName(e.target.value)
            }
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Administrator Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={styles.input}
          />
        </div>

      </div>

      {/* Notification Settings */}

      <div style={styles.card}>

        <h2>🔔 Notification Settings</h2>

        <div style={styles.settingRow}>

          <div>
            <strong>
              Enable Notifications
            </strong>

            <p style={styles.smallText}>
              Receive admission and system notifications
            </p>
          </div>

          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) =>
              setNotifications(e.target.checked)
            }
            style={styles.checkbox}
          />

        </div>

      </div>

      {/* Appearance */}

      <div style={styles.card}>

        <h2>🎨 Appearance</h2>

        <div style={styles.settingRow}>

          <div>
            <strong>
              Dark Mode
            </strong>

            <p style={styles.smallText}>
              Enable dark mode for the application
            </p>
          </div>

          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) =>
              setDarkMode(e.target.checked)
            }
            style={styles.checkbox}
          />

        </div>

      </div>

      {/* Database */}

      <div style={styles.card}>

        <h2>🗄️ Database</h2>

        <div style={styles.databaseGrid}>

          <div>
            <strong>Database</strong>
            <p>PostgreSQL</p>
          </div>

          <div>
            <strong>Database Name</strong>
            <p>admissiondb</p>
          </div>

          <div>
            <strong>API Gateway</strong>
            <p>Port 8086</p>
          </div>

          <div>
            <strong>Status</strong>
            <p style={styles.connected}>
              ● Connected
            </p>
          </div>

        </div>

      </div>

      {/* Save */}

      <button
        onClick={saveSettings}
        style={styles.saveButton}
      >
        💾 Save Settings
      </button>

    </div>
  );
}

const styles = {
  subtitle: {
    color: "#64748b",
    marginBottom: "25px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  formGroup: {
    marginBottom: "20px",
  },

  input: {
    display: "block",
    width: "100%",
    maxWidth: "600px",
    padding: "12px",
    marginTop: "8px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "14px",
  },

  settingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 0",
  },

  smallText: {
    color: "#64748b",
    margin: "5px 0 0",
    fontSize: "13px",
  },

  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },

  databaseGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },

  connected: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  saveButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },
};

export default Settings;
