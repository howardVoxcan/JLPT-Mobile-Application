from django.core.management.base import BaseCommand
from apps.shadowing.models import Voice


class Command(BaseCommand):
    help = "Populate sample voices for shadowing practice"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing voices before populating",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing voices...")
            Voice.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("- Cleared all voices"))

        self.stdout.write("\nPopulating voices...")

        voices_data = [
            {
                "name": "あおい",
                "display_name": "あおい (Nữ)",
                "gender": "female",
                "language": "ja",
                "description": "Giọng nữ trẻ, tự nhiên và dễ nghe",
            },
            {
                "name": "だいち",
                "display_name": "だいち (Nam)",
                "gender": "male",
                "language": "ja",
                "description": "Giọng nam trầm ấm, rõ ràng",
            },
            {
                "name": "まいこ",
                "display_name": "まいこ (Nữ)",
                "gender": "female",
                "language": "ja",
                "description": "Giọng nữ nhẹ nhàng, lịch sự",
            },
            {
                "name": "なおき",
                "display_name": "なおき (Nam)",
                "gender": "male",
                "language": "ja",
                "description": "Giọng nam năng động, trẻ trung",
            },
            {
                "name": "しのぶ",
                "display_name": "しのぶ (Nữ)",
                "gender": "female",
                "language": "ja",
                "description": "Giọng nữ trưởng thành, chuyên nghiệp",
            },
        ]

        created_count = 0
        for voice_data in voices_data:
            voice, created = Voice.objects.get_or_create(
                name=voice_data["name"],
                defaults={
                    "display_name": voice_data["display_name"],
                    "gender": voice_data["gender"],
                    "language": voice_data["language"],
                    "description": voice_data["description"],
                    "is_active": True,
                },
            )
            if created:
                created_count += 1
                self.stdout.write(f"  - Created: {voice.display_name}")
            else:
                self.stdout.write(f"  - Exists: {voice.display_name}")

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSuccessfully populated {created_count} new voices"
            )
        )
        self.stdout.write(
            self.style.SUCCESS(f"Total voices in database: {Voice.objects.count()}")
        )

