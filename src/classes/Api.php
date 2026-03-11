<?php

namespace JuztStack\JuztOrbit;

class Api
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_api']);
    }

    public function register_api()
    {
        register_rest_route('juzt-orbit/v1', '/data', [
            'methods' => 'GET',
            'callback' => [$this, 'handle_api_request'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('juzt-orbit/v1', '/comments/(?P<post_id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_comments'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('juzt-orbit/v1', '/user/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => function($request) {
                $user_id = (int) $request->get_param('id');
                return $this->get_user_data($user_id);
            },
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('juzt-orbit/v1', '/comments', [
            'methods' => 'POST',
            'callback' => [$this, 'save_comment'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function handle_api_request($request)
    {
        // Handle the API request and return a response
        return [
            'success' => true,
            'data' => 'Hello, World!',
        ];
    }

    public function get_comments($request)
    {
        $post_id = (int) $request->get_param('post_id');

        $comments = get_comments([
            'post_id' => $post_id,
            'update_comment_meta_cache' => true,
            'status' => 'approve',
            'orderby' => 'comment_date_gmt',
            'order' => 'ASC',
        ]);

        $comments_by_id = [];
        $tree = [];

        foreach ($comments as $comment) {
            $comment_id = (int) $comment->comment_ID;

            $comments_by_id[$comment_id] = [
                'comment_ID' => $comment_id,
                'comment_post_ID' => (int) $comment->comment_post_ID,
                'comment_parent' => (int) $comment->comment_parent,
                'comment_author' => $comment->comment_author,
                'comment_author_email' => $comment->comment_author_email,
                'comment_author_url' => $comment->comment_author_url,
                'comment_content' => $comment->comment_content,
                'comment_date' => $comment->comment_date,
                'comment_date_gmt' => $comment->comment_date_gmt,
                'children' => [],
            ];
        }

        foreach ($comments as $comment) {
            $comment_id = (int) $comment->comment_ID;
            $parent_id = (int) $comment->comment_parent;

            if ($parent_id > 0 && isset($comments_by_id[$parent_id])) {
                $comments_by_id[$parent_id]['children'][] = &$comments_by_id[$comment_id];
                continue;
            }

            $tree[] = &$comments_by_id[$comment_id];
        }

        return $tree;
    }

    public function get_user_data($user_id)
    {
        $user = get_user_by('id', $user_id);
        if (!$user) {
            return null;
        }

        return [
            'ID' => $user->ID,
            'user_login' => $user->user_login,
            'user_email' => $user->user_email,
            'display_name' => $user->display_name,
        ];
    }

    public function save_comment($request){
        $post_id = (int) $request->get_param('post_id');
        $comment = $request->get_param('comment');
        $author_name = sanitize_text_field($comment['author_name']);
        $author_email = sanitize_email($comment['author_email']);
        $content = sanitize_textarea_field($comment['content']);
        $parent_id = isset($comment['parent']) ? (int) $comment['parent'] : 0;

        $comment_data = [
            'comment_post_ID' => $post_id,
            'comment_author' => $author_name,
            'comment_author_email' => $author_email,
            'comment_content' => $content,
            'comment_approved' => 1,
            'comment_parent' => $parent_id, // Set to 0 for moderation
        ];

        $comment_id = wp_insert_comment($comment_data);

        if ($comment_id) {
            return [
                'success' => true,
                'message' => 'Comment submitted',
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Failed to submit comment.',
            ];
        }
    }
}