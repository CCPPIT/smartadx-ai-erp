# Authentication System Database Schema

## 1. Roles Table

```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    level INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name, description, level) VALUES
('SUPER_ADMIN', 'Full system access with all permissions', 5),
('ADMIN', 'Administrative access with most permissions', 4),
('MANAGER', 'Business management access', 3),
('ANALYST', 'Analytics and reporting access', 2),
('USER', 'Basic user access', 1);
```

## 2. Permissions Table

```sql
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert system permissions
INSERT INTO permissions (name, description, category) VALUES
-- Dashboard permissions
('view_dashboard', 'View dashboard overview', 'dashboard'),
('view_analytics', 'View analytics data', 'analytics'),
('view_reports', 'View system reports', 'reports'),

-- Campaign permissions
('create_campaign', 'Create new advertising campaigns', 'campaigns'),
('edit_campaign', 'Edit existing campaigns', 'campaigns'),
('delete_campaign', 'Delete campaigns', 'campaigns'),
('view_campaigns', 'View all campaigns', 'campaigns'),

-- Client permissions
('manage_clients', 'Manage client accounts', 'clients'),
('view_clients', 'View client information', 'clients'),

-- AI permissions
('use_ai_tools', 'Access AI-powered tools', 'ai'),
('generate_ai_content', 'Generate AI content', 'ai'),
('view_ai_insights', 'View AI-generated insights', 'ai'),

-- Design permissions
('use_design_studio', 'Access design studio', 'design'),
('create_designs', 'Create new designs', 'design'),
('edit_designs', 'Edit existing designs', 'design'),

-- System permissions
('manage_users', 'Manage user accounts', 'system'),
('manage_roles', 'Manage user roles', 'system'),
('manage_permissions', 'Manage system permissions', 'system'),
('view_system_status', 'View system status and health', 'system'),
('manage_settings', 'Modify system settings', 'system'),

-- Financial permissions
('view_billing', 'View billing information', 'billing'),
('manage_payments', 'Manage payments', 'billing'),

-- Notification permissions
('manage_notifications', 'Manage notification settings', 'notifications'),
('send_notifications', 'Send system notifications', 'notifications');
```

## 3. Role-Permission Mapping Table

```sql
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- Map permissions to roles
-- SUPER_ADMIN has all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'SUPER_ADMIN';

-- ADMIN permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'ADMIN' 
AND p.name IN (
    'view_dashboard', 'view_analytics', 'view_reports',
    'create_campaign', 'edit_campaign', 'delete_campaign', 'view_campaigns',
    'manage_clients', 'view_clients',
    'use_ai_tools', 'generate_ai_content', 'view_ai_insights',
    'use_design_studio', 'create_designs', 'edit_designs',
    'manage_users', 'view_system_status',
    'view_billing', 'manage_payments',
    'manage_notifications', 'send_notifications'
);

-- MANAGER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'MANAGER' 
AND p.name IN (
    'view_dashboard', 'view_analytics', 'view_reports',
    'create_campaign', 'edit_campaign', 'view_campaigns',
    'manage_clients', 'view_clients',
    'use_ai_tools', 'generate_ai_content', 'view_ai_insights',
    'use_design_studio', 'create_designs', 'edit_designs',
    'view_billing'
);

-- ANALYST permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'ANALYST' 
AND p.name IN (
    'view_dashboard', 'view_analytics', 'view_reports',
    'view_campaigns', 'view_clients',
    'use_ai_tools', 'view_ai_insights'
);

-- USER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'USER' 
AND p.name IN (
    'view_dashboard',
    'view_campaigns',
    'use_ai_tools'
);
```

## 4. Authentication Methods Table

```sql
CREATE TABLE authentication_methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert authentication methods
INSERT INTO authentication_methods (name, display_name, description, config) VALUES
('jwt', 'JSON Web Tokens (JWT)', 'Modern token-based authentication without server storage', 
 '{"expires_in": "24h", "algorithm": "RS256"}'),

('opaque', 'Opaque Tokens', 'Random tokens stored on the server', 
 '{"expires_in": "1h", "storage": "database"}'),

('oauth2_auth_code', 'Authorization Code Flow', 'For authentication with external applications', 
 '{"grant_type": "authorization_code", "pkce_required": true}'),

('oauth2_implicit', 'Implicit Flow', 'For single-page applications', 
 '{"grant_type": "implicit", "response_type": "token"}'),

('oauth2_client_creds', 'Client Credentials Flow', 'For server-to-server authentication', 
 '{"grant_type": "client_credentials", "audience": "api"}'),

('oauth2_device', 'Device Flow', 'For IoT device authentication', 
 '{"grant_type": "urn:ietf:params:oauth:grant-type:device_code"}'),

('mfa_totp', 'Time-based OTP (TOTP)', 'Google Authenticator or Authy', 
 '{"algorithm": "SHA1", "digits": 6, "period": 30}'),

('mfa_sms', 'SMS-based OTP', 'One-time code via SMS', 
 '{"provider": "twilio", "length": 6}'),

('mfa_email', 'Email-based OTP', 'One-time code via email', 
 '{"length": 6}'),

('biometric', 'Biometric Authentication', 'Fingerprint, face, or voice recognition', 
 '{"types": ["fingerprint", "face", "voice"]}'),

('passwordless', 'Passwordless Authentication', 'Magic links and one-time codes', 
 '{"methods": ["magic_link", "email_otp"]}'),

('social_auth', 'Social Authentication', 'Google, Facebook, GitHub login', 
 '{"providers": ["google", "facebook", "github"]}'),

('enterprise_saml', 'SAML Authentication', 'Enterprise SSO with SAML', 
 '{"binding": "post", "signature_algorithm": "rsa-sha256"}'),

('enterprise_ldap', 'LDAP Authentication', 'Enterprise directory authentication', 
 '{"protocol": "ldap", "encryption": "starttls"}'),

('enterprise_ad', 'Active Directory', 'Microsoft Active Directory', 
 '{"protocol": "ldap", "type": "active_directory"}');
```

## 5. User Authentication Methods Table

```sql
CREATE TABLE user_auth_methods (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    auth_method_id INTEGER REFERENCES authentication_methods(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    is_enabled BOOLEAN DEFAULT true,
    config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, auth_method_id)
);
```

## 6. Session Management Table

```sql
CREATE TABLE user_sessions (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    auth_method VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 7. Audit Log Table

```sql
CREATE TABLE auth_audit_log (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100),
    action VARCHAR(50) NOT NULL,
    auth_method VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage Examples

### Check User Permissions
```sql
-- Check if a user has a specific permission
SELECT COUNT(*) > 0 as has_permission
FROM role_permissions rp
JOIN user_roles ur ON rp.role_id = ur.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE ur.user_id = 'user-123' AND p.name = 'manage_users';
```

### Get User Roles and Permissions
```sql
-- Get all roles and permissions for a user
SELECT r.name as role_name, p.name as permission_name
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE ur.user_id = 'user-123';
```

### Authentication Method Configuration
```sql
-- Get active authentication methods
SELECT name, display_name, description, config
FROM authentication_methods
WHERE is_active = true
ORDER BY name;
```