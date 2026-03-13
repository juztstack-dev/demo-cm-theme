<?php

namespace JuztStack\JuztOrbit;

class Auth
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_api']);
    }

    public function register_api()
    {
        register_rest_route('juzt-orbit/v1', '/register', [
            'methods' => 'POST',
            'callback' => [$this, 'register_user'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('juzt-orbit/v1', '/login', [
            'methods' => 'POST',
            'callback' => [$this, 'login_user'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('juzt-orbit/v1', '/reset-password', [
            'methods' => 'POST',
            'callback' => [$this, 'reset_password'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('juzt-orbit/v1', '/set-password', [
            'methods' => 'POST',
            'callback' => [$this, 'set_new_password'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function set_new_password($request)
    {       
        $new_key = sanitize_text_field((string) $request->get_param('new_key'));
        $reset_login = sanitize_user((string) $request->get_param('reset_login'));
        $new_password = (string) $request->get_param('new_password');

        if (empty($new_key) || empty($reset_login) || empty($new_password)) {
            return [
                'success' => false,
                'message' => 'Reset key, login and new password are required.',
            ];
        }

        $user = check_password_reset_key($new_key, $reset_login);

        if (is_wp_error($user)) {
            return [
                'success' => false,
                'message' => $user->get_error_message(),
            ];
        }

        reset_password($user, $new_password);

        return [
            'success' => true,
            'message' => 'Password has been reset successfully.',
        ];
    }

    public function login_user($request)
    {
        $username = sanitize_user((string) $request->get_param('username'));
        $password = (string) $request->get_param('password');

        if (empty($username) || empty($password)) {
            return [
                'success' => false,
                'message' => 'Username and password are required.',
            ];
        }

        $user = wp_authenticate($username, $password);

        if (is_wp_error($user)) {
            return [
                'success' => false,
                'message' => 'Invalid username or password.',
            ];
        }

        wp_set_current_user($user->ID);
        wp_set_auth_cookie($user->ID);

        return [
            'success' => true,
            'message' => 'User logged in successfully.',
            'user' => [
                'id' => $user->ID,
                'username' => $user->user_login,
                'email' => $user->user_email,
                'role' => implode(', ', $user->roles),
            ],
        ];
    }

    public function register_user($request)
    {
        $username = sanitize_user((string) $request->get_param('username'));
        $email = sanitize_email((string) $request->get_param('email'));
        $password = (string) $request->get_param('password');

        if (empty($username) || empty($email) || empty($password)) {
            return [
                'success' => false,
                'message' => 'Username, email and password are required.',
            ];
        }

        if (!is_email($email)) {
            return [
                'success' => false,
                'message' => 'Invalid email address.',
            ];
        }

        if (username_exists($username)) {
            return [
                'success' => false,
                'message' => 'Username already exists.',
            ];
        }

        if (email_exists($email)) {
            return [
                'success' => false,
                'message' => 'Email already exists.',
            ];
        }

        $user_id = wp_create_user($username, $password, $email);

        if (is_wp_error($user_id)) {
            return [
                'success' => false,
                'message' => $user_id->get_error_message(),
            ];
        }

        $user = new \WP_User($user_id);
        $user->set_role('subscriber');

        return [
            'success' => true,
            'message' => 'User registered successfully.',
            'user' => [
                'id' => $user_id,
                'username' => $username,
                'email' => $email,
                'role' => 'subscriber',
            ],
        ];
    }

    public function reset_password($request)
    {
        $email = sanitize_email((string) $request->get_param('email'));

        if (empty($email)) {
            return [
                'success' => false,
                'message' => 'Email is required.',
            ];
        }

        if (!is_email($email)) {
            return [
                'success' => false,
                'message' => 'Invalid email address.',
            ];
        }

        $user = get_user_by('email', $email);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'No user found with that email address.',
            ];
        }

        $reset_key = get_password_reset_key($user);

        if (is_wp_error($reset_key)) {
            return [
                'success' => false,
                'message' => $reset_key->get_error_message(),
            ];
        }

        // Here you would send the reset email with the reset key
        // For simplicity, we'll just return the reset key in the response

        return [
            'success' => true,
            'message' => 'Password reset key generated successfully.',
            'reset_key' => $reset_key,
            'reset_login' => $user->user_login,
        ];
    }
}