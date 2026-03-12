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
}