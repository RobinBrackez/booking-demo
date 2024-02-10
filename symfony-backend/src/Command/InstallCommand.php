<?php

namespace App\Command;

use App\Service\Install\Contracts\InstallInterface;
use App\Service\Install\InstallBookings;
use App\Service\Install\InstallMeetingRooms;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:install',
    description: 'Install/update certain data. Use -- for each option, eg: --users. Use -vvv to see more output. Doesn\'t overwrite existing data.',
)]
class InstallCommand extends Command
{
    private const string OPTION_MEETING_ROOMS = 'meeting-rooms';
    private const string OPTION_BOOKINGS = 'bookings';

    /**
     * @var InstallInterface[]
     */
    private array $options;

    public function __construct(
        InstallBookings $installBookings,
        InstallMeetingRooms $installMeetingRooms,
        ?string $name = null
    ) {
        // Put them in a logical order, first meeting rooms, then bookings
        $this->options = [
            self::OPTION_MEETING_ROOMS => $installMeetingRooms,
            self::OPTION_BOOKINGS => $installBookings,
        ];

        parent::__construct($name);
    }

    protected function configure(): void
    {
        foreach ($this->options as $option => $installService) {
            $this->addOption($option);
        }
    }

    public function execute(InputInterface $input, OutputInterface $output): int
    {
        foreach ($this->options as $option => $installService) {
            if ($input->getOption($option)) {
                $output->writeln(sprintf('Installing %s', $option));
                $installService->execute();
                $output->writeln(sprintf('Installed %s', $option));
            }
        }

        return Command::SUCCESS;
    }
}
