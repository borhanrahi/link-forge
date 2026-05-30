"""Add tags, API keys, click goal alerts, A/B tests, and link enhancements

Revision ID: add_new_features_001
Revises: 
Create Date: 2026-05-30
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET

revision = 'add_new_features_001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Tags table
    op.create_table(
        'tags',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='cascade'), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('color', sa.String(7), default='#6366f1'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint('workspace_id', 'name'),
    )

    # Link tags junction table
    op.create_table(
        'link_tags',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('link_id', UUID(as_uuid=True), sa.ForeignKey('links.id', ondelete='cascade'), nullable=False),
        sa.Column('tag_id', UUID(as_uuid=True), sa.ForeignKey('tags.id', ondelete='cascade'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint('link_id', 'tag_id'),
    )

    # API keys table
    op.create_table(
        'api_keys',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='cascade'), nullable=False),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='cascade'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('key_hash', sa.String(64), nullable=False, unique=True),
        sa.Column('key_prefix', sa.String(10), nullable=False),
        sa.Column('scopes', sa.Text, default='read,write'),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('last_used_at', sa.DateTime(timezone=True)),
        sa.Column('expires_at', sa.DateTime(timezone=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Click goal alerts table
    op.create_table(
        'click_goal_alerts',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='cascade'), nullable=False),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='cascade'), nullable=False),
        sa.Column('link_id', UUID(as_uuid=True), sa.ForeignKey('links.id', ondelete='cascade'), nullable=False),
        sa.Column('goal_clicks', sa.BigInteger, nullable=False),
        sa.Column('is_achieved', sa.Boolean, default=False),
        sa.Column('achieved_at', sa.DateTime(timezone=True)),
        sa.Column('notify_email', sa.Boolean, default=True),
        sa.Column('notify_dashboard', sa.Boolean, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # A/B tests table
    op.create_table(
        'ab_tests',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='cascade'), nullable=False),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='cascade'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('short_code', sa.String(20), nullable=False, unique=True),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # A/B test variants table
    op.create_table(
        'ab_test_variants',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('ab_test_id', UUID(as_uuid=True), sa.ForeignKey('ab_tests.id', ondelete='cascade'), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('url', sa.String(2048), nullable=False),
        sa.Column('weight', sa.Float, default=50.0),
        sa.Column('clicks_count', sa.BigInteger, default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Add new columns to links table
    op.add_column('links', sa.Column('publish_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('links', sa.Column('position', sa.Integer, default=0))


def downgrade() -> None:
    op.drop_column('links', 'position')
    op.drop_column('links', 'publish_at')
    op.drop_table('ab_test_variants')
    op.drop_table('ab_tests')
    op.drop_table('click_goal_alerts')
    op.drop_table('api_keys')
    op.drop_table('link_tags')
    op.drop_table('tags')
