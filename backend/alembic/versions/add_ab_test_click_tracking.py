"""Add ab_test_variant_id to clicks table

Revision ID: add_ab_test_click_tracking_002
Revises: add_new_features_001
Create Date: 2026-05-30
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = 'add_ab_test_click_tracking_002'
down_revision = 'add_new_features_001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column('clicks', 'link_id', existing_type=UUID(as_uuid=True), nullable=True)
    op.add_column(
        'clicks',
        sa.Column(
            'ab_test_variant_id',
            UUID(as_uuid=True),
            sa.ForeignKey('ab_test_variants.id', ondelete='set_null'),
            nullable=True,
        ),
    )
    op.create_index('ix_clicks_ab_test_variant_id', 'clicks', ['ab_test_variant_id'])


def downgrade() -> None:
    op.drop_index('ix_clicks_ab_test_variant_id', table_name='clicks')
    op.drop_column('clicks', 'ab_test_variant_id')
    # Set NULL link_ids to a default before making non-nullable
    op.execute("UPDATE clicks SET link_id = '00000000-0000-0000-0000-000000000000' WHERE link_id IS NULL")
    op.alter_column('clicks', 'link_id', existing_type=UUID(as_uuid=True), nullable=False)
