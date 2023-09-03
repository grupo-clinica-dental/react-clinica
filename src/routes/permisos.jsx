import React, { useState, useEffect } from 'react';

export const Permises = () => {
  // Simulación de datos de permisos desde una API
  return new Promise(resolve => {
    setTimeout(() => {
      const permissionsData = [
        { id: 1, name: 'View Dashboard', enabled: true },
        { id: 2, name: 'Edit Profile', enabled: false },
        { id: 3, name: 'Create Posts', enabled: true },
      ];
      resolve(permissionsData);
    }, 1000); // Simulamos un retraso de 1 segundo
  });
};

const PermissionScreen = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      const permissionsData = await Permises();
      setPermissions(permissionsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setLoading(false);
    }
  };

  const updatePermission = (id, enabled) => {
    setPermissions(prevPermissions =>
      prevPermissions.map(permission =>
        permission.id === id ? { ...permission, enabled } : permission
      )
    );
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Permission Screen</h2>
      <ul>
        {permissions.map(permission => (
          <li key={permission.id}>
            {permission.name}
            <label>
              <input
                type="checkbox"
                checked={permission.enabled}
                onChange={e => updatePermission(permission.id, e.target.checked)}
              />
              Enable
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PermissionScreen;
